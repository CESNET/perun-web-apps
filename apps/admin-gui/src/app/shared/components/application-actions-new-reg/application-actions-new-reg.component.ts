import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplicationStateSelectorComponent,
  DebounceFilterComponent,
  RefreshButtonComponent,
  SimpleApplicationsListComponent,
} from '@perun-web-apps/perun/components';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, forkJoin, merge, Observable, of, switchMap } from 'rxjs';
import {
  AppState,
  Attribute,
  AttributeDefinition,
  Group,
  GroupsManagerService,
  PerunException,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { FormControl } from '@angular/forms';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import {
  ApplicationWithStringId,
  downloadApplicationsData,
  getDataForExport,
  mapToAppWithId,
} from '@perun-web-apps/perun/utils';
import { PageQuery, RPCError } from '@perun-web-apps/perun/models';
import { SelectionModel } from '@angular/cdk/collections';
import { getExportDataForColumn } from '@perun-web-apps/perun/utils';
import { DateRangeComponent } from '@perun-web-apps/perun/components';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import {
  ApplicationDTO,
  IdmObject,
  PagedModelEnrichedApplicationDTO,
  SubmissionsService,
} from '@perun-web-apps/perun/registrar-openapi';
import { map, startWith, tap } from 'rxjs/operators';

export interface AppAction {
  approve: boolean;
  reject: boolean;
  delete: boolean;
  resend: boolean;
  columnSettings?: boolean;
}

interface AppActionTooltip {
  approve: string;
  reject: string;
  delete: string;
  resend: string;
  columnSettings?: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    MatTooltip,
    ApplicationStateSelectorComponent,
    DateRangeComponent,
    LoadingTableComponent,
    SimpleApplicationsListComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-application-actions-new-reg',
  templateUrl: './application-actions-new-reg.component.html',
  styleUrls: ['./application-actions-new-reg.component.scss'],
})
export class ApplicationActionsNewRegComponent implements OnInit {
  @Input() theme: string;
  @Input() vo: Vo;
  @Input() group: Group;
  @Input() authRights: AppAction;
  @Input() tableId: string;
  @Input() detailTableId: string;
  @Input() fedAttrs: AttributeDefinition[];
  @Output() changeView = new EventEmitter<void>();

  refresh = false;

  tooltipMessages: AppActionTooltip = {
    approve: '',
    reject: '',
    delete: '',
    resend: '',
    columnSettings: '',
  };
  canPerformAction: AppAction = {
    approve: false,
    reject: false,
    delete: false,
    resend: false,
  };

  currentStates: ApplicationDTO.StateEnum[] = ['SUBMITTED', 'VERIFIED'];

  filterValue = '';

  startDate: FormControl<Date> = new FormControl<Date>(this.yearAgo());
  endDate: FormControl<Date> = new FormControl<Date>(new Date());

  showAllDetails = false;
  showGroupApps = false;
  showSubgroupApps = false;

  prependColumns = ['id'];
  groupPrependColumns = ['groupId', 'groupName'];
  simpleColumns: string[] = ['createdAt', 'type', 'state', 'createdBy', 'modifiedBy'];
  bulkOperationFailureColumns = ['id', 'createdAt', 'createdBy', 'error'];
  bulkOperationFailureGroupColumns = [
    'id',
    'groupId',
    'groupName',
    'createdAt',
    'createdBy',
    'error',
  ];
  detailedColumns: string[] = [
    'createdAt',
    'type',
    'state',
    'extSourceName',
    'user',
    'createdBy',
    'modifiedBy',
    'modifiedAt',
    'fedInfo',
  ];

  currentColumns: string[] = [];
  configuredColumns: string[] = [];
  configuredFedColumns: string[] = [];
  idToGroupMap: Map<number, Group> = new Map<number, Group>();

  currentIdmObjects: IdmObject[] = [];

  nextPage = new BehaviorSubject<PageQuery>({});
  applicationsPage$: Observable<PagedModelEnrichedApplicationDTO> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.submissionsService.getApplicationsForObjects(
        {
          states: this.currentStates,
          idmObjects: this.currentIdmObjects,
        },
        Math.floor(pageQuery.offset / pageQuery.pageSize),
        pageQuery.pageSize,
        [pageQuery.sortColumnOriginal + ',' + (pageQuery.order === 'ASCENDING' ? 'asc' : 'desc')],
      ),
    ),
    tap((page) => {
      const helper: ApplicationWithStringId[] = [];
      for (const app of page.content) {
        helper.push(mapToAppWithId(app, this.vo, this.idToGroupMap));
      }
      this.applications = helper;
      this.selected.clear();
      setTimeout(() => this.loadingSubject$.next(false), 200);
    }),
    startWith({ content: [], page: { size: 0, number: 0, totalElements: 0, totalPages: 0 } }),
  );
  applications: ApplicationWithStringId[] = [];

  selected: SelectionModel<ApplicationWithStringId> = new SelectionModel<ApplicationWithStringId>(
    false,
    [],
    true,
    (app1, app2) => app1.uuid === app2.uuid,
  );
  loadingSubject$ = new BehaviorSubject(false);
  cacheSubject = new BehaviorSubject(true);
  resetPagination = new BehaviorSubject(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );

  constructor(
    private submissionsService: SubmissionsService,
    private notificator: NotificatorService,
    private translate: PerunTranslateService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private groupsManager: GroupsManagerService,
  ) {}

  @Input() set viewPreferences(att: Attribute) {
    if ((att?.value as Array<string>)?.length > 0) {
      this.configuredColumns = att.value as Array<string>;
      this.configuredFedColumns = this.configuredColumns.filter((column) =>
        this.fedAttrs.some((attr) => attr.friendlyName === column),
      );
    } else {
      this.configuredColumns = [];
      this.configuredFedColumns = [];
    }
    this.authRights.columnSettings = att?.writable;
    this.currentColumns = this.setColumns();
  }

  ngOnInit(): void {
    this.showGroupApps = !!this.group;

    this.refreshTable();

    this.selected.changed.subscribe(() => this.onSelectedApplicationsChange());
    this.onSelectedApplicationsChange();
    this.startDate.valueChanges.subscribe(() => this.refreshTable());
    this.endDate.valueChanges.subscribe(() => this.refreshTable());
  }

  refreshTable(): void {
    this.currentIdmObjects = [];

    // Build base IDM objects
    if (this.group) {
      this.idToGroupMap.set(this.group.id, this.group);
      this.currentIdmObjects.push({ idmObjectType: 'GROUP', objectId: this.group.id.toString() });
    } else {
      this.currentIdmObjects.push({ idmObjectType: 'VO', objectId: this.vo.id.toString() });
    }

    // Conditionally create observables for additional groups
    const groups$ =
      this.showGroupApps && !this.group ? this.groupsManager.getAllGroups(this.vo.id) : of([]);

    const subgroups$ =
      this.showSubgroupApps && this.group
        ? this.groupsManager.getAllSubGroups(this.group.id)
        : of([]);

    // Use forkJoin to wait for all conditional requests
    forkJoin({
      groups: groups$,
      subgroups: subgroups$,
    })
      .pipe(
        tap(({ groups, subgroups }) => {
          // Add group IDs to idmObjects
          groups.forEach((group: Group) => {
            this.idToGroupMap.set(group.id, group);
            this.currentIdmObjects.push({ idmObjectType: 'GROUP', objectId: group.id.toString() });
          });

          // Add subgroup IDs to idmObjects
          subgroups.forEach((subgroup: Group) => {
            this.idToGroupMap.set(subgroup.id, subgroup);
            this.currentIdmObjects.push({
              idmObjectType: 'GROUP',
              objectId: subgroup.id.toString(),
            });
          });
        }),
      )
      .subscribe(() => {
        this.resetPagination.next(true);
        this.cacheSubject.next(true);
        this.nextPage.next(this.nextPage.value);
      });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  statesChanged(states: AppState[] | null): void {
    this.currentStates = states
      ? states.map((state) => this.convertState(state))
      : ['SUBMITTED', 'VERIFIED', 'APPROVED', 'REJECTED'];
    this.refreshTable();
  }

  viewChanged(): void {
    this.changeView.emit();
  }

  toggleDetailedView(): void {
    this.showAllDetails = !this.showAllDetails;
    this.currentColumns = this.setColumns();

    this.tooltipMessages.columnSettings = this.translate.instant(
      this.showAllDetails
        ? 'VO_DETAIL.APPLICATION.COLUMNS_TOOLTIP'
        : 'VO_DETAIL.APPLICATION.SET_COLUMN_SETTINGS',
    );
  }

  toggleIncludeGroups(): void {
    this.showGroupApps = !this.showGroupApps;
    this.currentColumns = this.setColumns();
    this.refreshTable();
  }
  toggleIncludeSubGroups(): void {
    this.showSubgroupApps = !this.showSubgroupApps;
    this.currentColumns = this.setColumns();
    this.refreshTable();
  }

  onSelectedApplicationsChange(): void {
    const state = this.getSelectedState();
    this.setCanPerform(state);
    this.setButtonsTooltips(state);
    this.cd.detectChanges();
  }

  downloadAll(a: { format: string; length: number }): void {
    this.submissionsService
      .getApplicationsForObjects(
        {
          states: this.currentStates,
          idmObjects: this.currentIdmObjects,
        },
        0,
        a.length,
      )
      .subscribe({
        next: (paginated) => {
          downloadApplicationsData(
            getDataForExport(
              paginated.content.map((app) => mapToAppWithId(app, this.vo, this.idToGroupMap)),
              this.currentColumns,
              getExportDataForColumn,
            ),
            this.translate,
            a.format,
          );
        },
      });
  }

  // Adds a call property to the PerunException so it can be used in the bug report FIXME better way?
  private addCallToException(exception: PerunException, call: string): RPCError {
    if (exception == null) {
      return null;
    }
    const rpcException = exception as RPCError;
    rpcException.call = call;
    return rpcException;
  }

  private getSelectedState(): AppState {
    if (this.selected.selected.length === 0) return null;

    let state = this.selected.selected[0].state;
    for (const app of this.selected.selected) {
      if (app.state !== state) {
        state = null;
        break;
      }
    }

    return state;
  }

  private setCanPerform(state: AppState): void {
    this.canPerformAction.approve = state === 'NEW' || state === 'VERIFIED';
    this.canPerformAction.reject = state === 'NEW' || state === 'VERIFIED';
    this.canPerformAction.delete = state === 'NEW' || state === 'REJECTED';
    this.canPerformAction.resend = !!state;
  }

  private convertState(state: AppState): ApplicationDTO.StateEnum {
    switch (state) {
      case 'APPROVED':
        return ApplicationDTO.StateEnum.APPROVED;
      case 'REJECTED':
        return ApplicationDTO.StateEnum.REJECTED;
      case 'VERIFIED':
        return ApplicationDTO.StateEnum.VERIFIED;
      case 'NEW':
        return ApplicationDTO.StateEnum.SUBMITTED;
      default:
        return ApplicationDTO.StateEnum.SUBMITTED;
    }
  }

  private setButtonsTooltips(state: AppState): void {
    if (state) {
      this.tooltipMessages.approve = this.translate.instant(
        `VO_DETAIL.APPLICATION.TOOLTIPS.APPROVE.${state}`,
      );
      this.tooltipMessages.reject = this.translate.instant(
        `VO_DETAIL.APPLICATION.TOOLTIPS.REJECT.${state}`,
      );
      this.tooltipMessages.delete = this.translate.instant(
        `VO_DETAIL.APPLICATION.TOOLTIPS.DELETE.${state}`,
      );
      this.tooltipMessages.resend = this.translate.instant(
        `VO_DETAIL.APPLICATION.TOOLTIPS.SEND_NOTIFICATION.${state}`,
      );
    } else {
      const tooltip = this.translate.instant(
        this.selected.selected.length
          ? 'VO_DETAIL.APPLICATION.TOOLTIPS.MULTIPLE_STATUSES_SELECTED'
          : 'VO_DETAIL.APPLICATION.TOOLTIPS.NO_APPLICATION_SELECTED',
      );
      this.tooltipMessages.approve = tooltip;
      this.tooltipMessages.reject = tooltip;
      this.tooltipMessages.delete = tooltip;
      this.tooltipMessages.resend = tooltip;
    }

    this.tooltipMessages.columnSettings = this.translate.instant(
      'VO_DETAIL.APPLICATION.COLUMN_SETTINGS_NEW_REG',
    );
  }
  private setColumns(): string[] {
    let columns: string[] = this.prependColumns;
    if (this.showGroupApps) {
      columns = this.prependColumns.concat(this.groupPrependColumns);
    }
    if (this.showAllDetails) {
      return columns.concat(this.detailedColumns);
    }
    if (this.configuredColumns.length > 0) {
      return columns.concat(this.configuredColumns);
    }

    return columns.concat(this.simpleColumns);
  }

  private yearAgo(): Date {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 365);
    return newDate;
  }
}
