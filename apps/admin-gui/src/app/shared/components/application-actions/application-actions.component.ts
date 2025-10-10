import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplicationsListComponent,
  ApplicationStateSelectorComponent,
  DebounceFilterComponent,
  RefreshButtonComponent,
} from '@perun-web-apps/perun/components';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import {
  Application,
  ApplicationOperationResult,
  AppState,
  Attribute,
  AttributeDefinition,
  Group,
  MailType,
  PaginatedRichApplications,
  PerunException,
  RegistrarManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { FormControl } from '@angular/forms';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationsBulkOperationDialogComponent } from '../dialogs/applications-bulk-operation-dialog/applications-bulk-operation-dialog.component';
import {
  downloadApplicationsData,
  getDataForExport,
  getDefaultDialogConfig,
} from '@perun-web-apps/perun/utils';
import { PageQuery, RPCError } from '@perun-web-apps/perun/models';
import { ApplicationsBulkOperationFailureDialogComponent } from '../dialogs/applications-bulk-operation-failure-dialog/applications-bulk-operation-failure-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import {
  dateToString,
  getExportDataForColumn,
  getSortDataColumnQuery,
} from '@perun-web-apps/perun/utils';
import { DateRangeComponent } from '@perun-web-apps/perun/components';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

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
    ApplicationsListComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-application-actions',
  templateUrl: './application-actions.component.html',
  styleUrls: ['./application-actions.component.scss'],
})
export class ApplicationActionsComponent implements OnInit {
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

  currentStates: AppState[] = ['NEW', 'VERIFIED'];

  filterValue = '';

  startDate: FormControl<Date> = new FormControl<Date>(this.yearAgo());
  endDate: FormControl<Date> = new FormControl<Date>(new Date());

  showAllDetails = false;
  showGroupApps = false;
  showSubgroupApps = false;

  prependColumns = ['checkbox', 'id'];
  groupPrependColumns = ['groupId', 'groupName'];
  simpleColumns: string[] = ['createdAt', 'type', 'state', 'createdBy', 'modifiedBy'];
  bulkOperationFailureColumns = ['checkbox', 'id', 'createdAt', 'createdBy', 'error'];
  bulkOperationFailureGroupColumns = [
    'checkbox',
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
    'extSourceType',
    'user',
    'createdBy',
    'modifiedBy',
    'modifiedAt',
    'fedInfo',
  ];

  currentColumns: string[] = [];
  configuredColumns: string[] = [];
  configuredFedColumns: string[] = [];

  applications: Application[] = [];
  nextPage = new BehaviorSubject<PageQuery>({});
  applicationsPage$: Observable<PaginatedRichApplications> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.registrarService.getApplicationsPage({
        vo: this.group ? this.group.voId : this.vo.id,
        query: {
          pageSize: pageQuery.pageSize,
          offset: pageQuery.offset,
          order: pageQuery.order,
          sortColumn: getSortDataColumnQuery(pageQuery.sortColumn),
          searchString: pageQuery.searchString,
          includeGroupApplications: this.showGroupApps,
          includeSubGroupApplications: this.showSubgroupApps,
          getDetails: this.showAllDetails,
          states: this.currentStates,
          dateFrom: dateToString(this.startDate.value),
          dateTo: dateToString(this.endDate.value),
          groupId: this.group?.id,
        },
      }),
    ),
    // 'Tapping' is generally a last resort
    tap((page) => {
      this.applications = page.data;
      this.selected.clear();
      setTimeout(() => this.loadingSubject$.next(false), 200);
    }),
    startWith({ data: [], totalCount: 0, offset: 0, pageSize: 0 }),
  );

  selected: SelectionModel<Application> = new SelectionModel<Application>(
    true,
    [],
    true,
    (app1, app2) => app1.id === app2.id,
  );
  loadingSubject$ = new BehaviorSubject(false);
  cacheSubject = new BehaviorSubject(true);
  resetPagination = new BehaviorSubject(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );

  callMap = new Map([
    ['APPROVE', '/registrarManager/approveApplications'],
    ['REJECT', '/registrarManager/rejectApplications'],
    ['DELETE', '/registrarManager/deleteApplications'],
  ]);

  constructor(
    private registrarService: RegistrarManagerService,
    private notificator: NotificatorService,
    private translate: PerunTranslateService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
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
    this.selected.changed.subscribe(() => this.onSelectedApplicationsChange());
    this.onSelectedApplicationsChange();
    this.startDate.valueChanges.subscribe(() => this.refreshTable());
    this.endDate.valueChanges.subscribe(() => this.refreshTable());
  }

  refreshTable(): void {
    this.resetPagination.next(true);
    this.cacheSubject.next(true);
    this.nextPage.next(this.nextPage.value);
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  onApprove(): void {
    const dialogRef = this.openDialog(
      'VO_DETAIL.APPLICATION.DIALOG.APPROVE.TITLE',
      'VO_DETAIL.APPLICATION.DIALOG.APPROVE.DESCRIPTION',
      'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.APPROVE',
      'APPROVE',
      this.selected.selected,
      this.currentColumns,
    );
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loadingSubject$.next(true);
        this.registrarService
          .approveApplications(this.selected.selected.map((app) => app.id))
          .subscribe({
            next: (approveApplicationsResult: [ApplicationOperationResult]) => {
              if (approveApplicationsResult.some((result) => result.error !== null)) {
                this.errorsInBulkOperation(
                  approveApplicationsResult,
                  this.selected.selected,
                  'APPROVE',
                );
              } else {
                this.notificator.showInstantSuccess(
                  'VO_DETAIL.APPLICATION.SUCCESS.APPROVE_NOTIFICATION',
                );
              }
              this.refreshTable();
            },
            error: (error: RPCError) => {
              this.notificator.showRPCError(error);
              this.refreshTable();
            },
          });
      }
    });
  }

  onReject(): void {
    const dialogRef = this.openDialog(
      'VO_DETAIL.APPLICATION.DIALOG.REJECT.TITLE',
      'VO_DETAIL.APPLICATION.DIALOG.REJECT.DESCRIPTION',
      'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.REJECT',
      'REJECT',
      this.selected.selected,
      this.currentColumns,
    );
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loadingSubject$.next(true);
        this.registrarService
          .rejectApplications(this.selected.selected.map((app) => app.id))
          .subscribe({
            next: (rejectApplicationsResult: [ApplicationOperationResult]) => {
              if (rejectApplicationsResult.some((result) => result.error !== null)) {
                this.errorsInBulkOperation(
                  rejectApplicationsResult,
                  this.selected.selected,
                  'REJECT',
                );
              } else {
                this.notificator.showInstantSuccess(
                  'VO_DETAIL.APPLICATION.SUCCESS.REJECT_NOTIFICATION',
                );
              }
              this.refreshTable();
            },
            error: (error: RPCError) => {
              this.notificator.showRPCError(error);
              this.refreshTable();
            },
          });
      }
    });
  }

  onDelete(): void {
    const dialogRef = this.openDialog(
      'VO_DETAIL.APPLICATION.DIALOG.DELETE.TITLE',
      'VO_DETAIL.APPLICATION.DIALOG.DELETE.DESCRIPTION',
      'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.DELETE',
      'DELETE',
      this.selected.selected,
      this.currentColumns,
    );
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loadingSubject$.next(true);
        this.registrarService
          .deleteApplications(this.selected.selected.map((app) => app.id))
          .subscribe({
            next: (deleteApplicationsResult: [ApplicationOperationResult]) => {
              if (deleteApplicationsResult.some((result) => result.error !== null)) {
                this.errorsInBulkOperation(
                  deleteApplicationsResult,
                  this.selected.selected,
                  'DELETE',
                );
              } else {
                this.notificator.showInstantSuccess(
                  'VO_DETAIL.APPLICATION.SUCCESS.DELETE_NOTIFICATION',
                );
              }
              this.refreshTable();
            },
            error: (error: RPCError) => {
              this.notificator.showRPCError(error);
              this.refreshTable();
            },
          });
      }
    });
  }

  onResend(): void {
    const dialogRef = this.openDialog(
      'VO_DETAIL.APPLICATION.DIALOG.RESEND.TITLE',
      'VO_DETAIL.APPLICATION.DIALOG.RESEND.DESCRIPTION',
      'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.SEND_NOTIFICATION',
      'RESEND',
      this.selected.selected,
      this.currentColumns,
    );
    dialogRef.afterClosed().subscribe((resendForm: { type: MailType; reason: string }) => {
      if (resendForm) {
        this.loadingSubject$.next(true);
        this.registrarService
          .sendMessages({
            ids: this.selected.selected.map((app) => app.id),
            mailType: resendForm.type,
            reason: resendForm.reason,
          })
          .subscribe({
            next: () => {
              this.notificator.showInstantSuccess('VO_DETAIL.APPLICATION.SUCCESS.RESEND');
              this.refreshTable();
            },
            error: () => {
              this.loadingSubject$.next(false);
            },
          });
      }
    });
  }

  statesChanged(states: AppState[]): void {
    this.currentStates = states;
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
    const query = this.nextPage.getValue();

    this.registrarService
      .getApplicationsPage({
        vo: this.vo ? this.vo.id : this.group.voId,
        query: {
          order: query.order,
          pageSize: a.length,
          offset: 0,
          searchString: query.searchString,
          sortColumn: getSortDataColumnQuery(query.sortColumn),
          includeGroupApplications: this.showGroupApps,
          getDetails: this.showAllDetails,
          states: this.currentStates,
          dateFrom: dateToString(this.startDate.value),
          dateTo: dateToString(this.endDate.value),
          groupId: this.group?.id,
        },
      })
      .subscribe({
        next: (paginatedGroups) => {
          downloadApplicationsData(
            getDataForExport(paginatedGroups.data, this.currentColumns, getExportDataForColumn),
            this.translate,
            a.format,
          );
        },
      });
  }

  private errorsInBulkOperation(
    bulkOperationsResult: [ApplicationOperationResult],
    selectedApplications: Application[],
    operation: string,
  ): void {
    const resultsMap = new Map<number, PerunException>();
    bulkOperationsResult.forEach((res) => {
      resultsMap.set(res.applicationId, res.error);
    });
    const appErrorPairs: [Application, PerunException][] = selectedApplications.map((app) => [
      app,
      this.addCallToException(resultsMap.get(app.id), this.callMap.get(operation)),
    ]);
    const groupAppIncluded = selectedApplications.some((app) => app.group !== null);
    const config = getDefaultDialogConfig();
    config.width = '1300px';
    config.data = {
      theme: this.theme,
      action: operation,
      applicationsResults: appErrorPairs,
      displayedColumns: groupAppIncluded
        ? this.bulkOperationFailureGroupColumns
        : this.bulkOperationFailureColumns,
    };
    this.notificator.showInstantError(
      'VO_DETAIL.APPLICATION.ERROR.' + operation + '_NOTIFICATION',
      null,
      '',
      'VO_DETAIL.APPLICATION.SHOW',
      () => {
        const dialogRef = this.dialog.open(ApplicationsBulkOperationFailureDialogComponent, config);
        dialogRef.afterClosed().subscribe((success) => {
          if (success) {
            this.refreshTable();
          }
        });
      },
    );
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
      this.showAllDetails
        ? 'VO_DETAIL.APPLICATION.COLUMNS_TOOLTIP'
        : 'VO_DETAIL.APPLICATION.SET_COLUMN_SETTINGS',
    );
  }

  private openDialog(
    title: string,
    description: string,
    confirmButtonLabel: string,
    selectedAction: 'APPROVE' | 'REJECT' | 'DELETE' | 'RESEND',
    applications: Application[],
    columns: string[],
  ): MatDialogRef<ApplicationsBulkOperationDialogComponent> {
    const columnsToDisplay = columns.filter(
      (column) => column !== 'checkbox' && column !== 'state',
    );

    const config = getDefaultDialogConfig();
    config.width = '1300px';
    config.data = {
      theme: this.theme,
      title: title,
      description: description,
      confirmButtonLabel: confirmButtonLabel,
      action: selectedAction,
      selectedApplications: applications,
      displayedColumns: columnsToDisplay,
      allowGroupMailType: !!this.group,
      fedColumnsFriendly: this.configuredFedColumns,
      fedAttrs: this.fedAttrs,
      voId: this.vo?.id,
      groupId: this.group?.id,
    };

    return this.dialog.open(ApplicationsBulkOperationDialogComponent, config);
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
