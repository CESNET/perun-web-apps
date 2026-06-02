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
import { BehaviorSubject, forkJoin, of, switchMap } from 'rxjs';
import {
  Application,
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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationsBulkOperationDialogComponent } from '../dialogs/applications-bulk-operation-dialog/applications-bulk-operation-dialog.component';
import {
  ApplicationWithStringId,
  downloadApplicationsData,
  getDataForExport,
  getDefaultDialogConfig,
} from '@perun-web-apps/perun/utils';
import { RPCError } from '@perun-web-apps/perun/models';
import { SelectionModel } from '@angular/cdk/collections';
import { getExportDataForColumn } from '@perun-web-apps/perun/utils';
import { DateRangeComponent } from '@perun-web-apps/perun/components';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import {
  ApplicationDTO,
  EnrichedApplicationDTO,
  IdmObject,
  SubmissionsService,
} from '@perun-web-apps/perun/registrar-openapi';

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

  currentStates: AppState[] = ['NEW', 'VERIFIED'];

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
  idToGroupMap = new Map<number, Group>();

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
  loading = true;

  callMap = new Map([
    ['APPROVE', '/registrarManager/approveApplications'],
    ['REJECT', '/registrarManager/rejectApplications'],
    ['DELETE', '/registrarManager/deleteApplications'],
  ]);

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
    this.loading = true;

    this.refreshTable();

    this.selected.changed.subscribe(() => this.onSelectedApplicationsChange());
    this.onSelectedApplicationsChange();
    this.startDate.valueChanges.subscribe(() => this.refreshTable());
    this.endDate.valueChanges.subscribe(() => this.refreshTable());
  }

  refreshTable(): void {
    this.loading = true;

    // Build base IDM objects
    const idmObjects: IdmObject[] = [];
    if (this.group) {
      this.idToGroupMap.set(this.group.id, this.group);
      idmObjects.push({ idmObjectType: 'GROUP', objectId: this.group.id.toString() });
    } else {
      idmObjects.push({ idmObjectType: 'VO', objectId: this.vo.id.toString() });
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
        switchMap(({ groups, subgroups }) => {
          // Add group IDs to idmObjects
          groups.forEach((group: Group) => {
            this.idToGroupMap.set(group.id, group);
            idmObjects.push({ idmObjectType: 'GROUP', objectId: group.id.toString() });
          });

          // Add subgroup IDs to idmObjects
          subgroups.forEach((subgroup: Group) => {
            this.idToGroupMap.set(subgroup.id, subgroup);
            idmObjects.push({ idmObjectType: 'GROUP', objectId: subgroup.id.toString() });
          });

          // Call API with complete idmObjects
          return this.submissionsService.getApplicationsForObjects({
            idmObjects: idmObjects,
            states: this.currentStates.map((state) => (state === 'NEW' ? 'SUBMITTED' : state)),
          });
        }),
      )
      .subscribe({
        next: (enrichedApps: EnrichedApplicationDTO[]) => {
          const helper: ApplicationWithStringId[] = [];
          for (const app of enrichedApps) {
            const ourApp: ApplicationWithStringId = {
              uuid: app.application.id,
              vo: this.vo,
              group: this.group,
              type: app.application.type.formType === 'INITIAL' ? 'INITIAL' : 'EXTENSION',
              extSourceName: app.submission.identityIssuer,
              createdBy: app.submission.submitterName,
              createdAt: app.submission.timestamp,
              modifiedAt: app.submission.timestamp,
              modifiedBy: app.submission.submitterName,
              user: null,
              fedInfo: Object.entries(app.submission.identityAttributes)
                .map(([key, value]) => `${key}:${value}`)
                .join(','),
            };
            if (app.form.idmObject.idmObjectType === 'GROUP') {
              ourApp.group = this.idToGroupMap.get(Number(app.form.idmObject.objectId));
            }
            const lastDecision = app.decisions?.[app.decisions.length - 1];
            if (lastDecision) {
              ourApp.modifiedAt = lastDecision.timestamp;
              ourApp.modifiedBy = lastDecision.approverName;
            }
            switch (app.application.state) {
              case 'APPROVED':
                ourApp.state = 'APPROVED';
                break;
              case 'REJECTED':
                ourApp.state = 'REJECTED';
                break;
              case 'VERIFIED':
                ourApp.state = 'VERIFIED';
                break;
              case 'SUBMITTED':
                ourApp.state = 'NEW';
                break;
            }
            helper.push(ourApp);
          }
          this.applications = helper;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });

    this.resetPagination.next(true);
    this.cacheSubject.next(true);
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  // onApprove(): void {
  //   const dialogRef = this.openDialog(
  //     'VO_DETAIL.APPLICATION.DIALOG.APPROVE.TITLE',
  //     'VO_DETAIL.APPLICATION.DIALOG.APPROVE.DESCRIPTION',
  //     'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.APPROVE',
  //     'APPROVE',
  //     this.selected.selected,
  //     this.currentColumns,
  //   );
  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       this.loadingSubject$.next(true);
  //       this.registrarService
  //         .approveApplications(this.selected.selected.map((app) => app.id))
  //         .subscribe({
  //           next: (approveApplicationsResult: [ApplicationOperationResult]) => {
  //             if (approveApplicationsResult.some((result) => result.error !== null)) {
  //               this.errorsInBulkOperation(
  //                 approveApplicationsResult,
  //                 this.selected.selected,
  //                 'APPROVE',
  //               );
  //             } else {
  //               this.notificator.showInstantSuccess(
  //                 'VO_DETAIL.APPLICATION.SUCCESS.APPROVE_NOTIFICATION',
  //               );
  //             }
  //             this.refreshTable();
  //           },
  //           error: (error: RPCError) => {
  //             this.notificator.showRPCError(error);
  //             this.refreshTable();
  //           },
  //         });
  //     }
  //   });
  // }

  // onReject(): void {
  //   const dialogRef = this.openDialog(
  //     'VO_DETAIL.APPLICATION.DIALOG.REJECT.TITLE',
  //     'VO_DETAIL.APPLICATION.DIALOG.REJECT.DESCRIPTION',
  //     'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.REJECT',
  //     'REJECT',
  //     this.selected.selected,
  //     this.currentColumns,
  //   );
  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       this.loadingSubject$.next(true);
  //       this.registrarService
  //         .rejectApplications(this.selected.selected.map((app) => app.id))
  //         .subscribe({
  //           next: (rejectApplicationsResult: [ApplicationOperationResult]) => {
  //             if (rejectApplicationsResult.some((result) => result.error !== null)) {
  //               this.errorsInBulkOperation(
  //                 rejectApplicationsResult,
  //                 this.selected.selected,
  //                 'REJECT',
  //               );
  //             } else {
  //               this.notificator.showInstantSuccess(
  //                 'VO_DETAIL.APPLICATION.SUCCESS.REJECT_NOTIFICATION',
  //               );
  //             }
  //             this.refreshTable();
  //           },
  //           error: (error: RPCError) => {
  //             this.notificator.showRPCError(error);
  //             this.refreshTable();
  //           },
  //         });
  //     }
  //   });
  // }

  // onDelete(): void {
  //   const dialogRef = this.openDialog(
  //     'VO_DETAIL.APPLICATION.DIALOG.DELETE.TITLE',
  //     'VO_DETAIL.APPLICATION.DIALOG.DELETE.DESCRIPTION',
  //     'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.DELETE',
  //     'DELETE',
  //     this.selected.selected,
  //     this.currentColumns,
  //   );
  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       this.loadingSubject$.next(true);
  //       this.registrarService
  //         .deleteApplications(this.selected.selected.map((app) => app.id))
  //         .subscribe({
  //           next: (deleteApplicationsResult: [ApplicationOperationResult]) => {
  //             if (deleteApplicationsResult.some((result) => result.error !== null)) {
  //               this.errorsInBulkOperation(
  //                 deleteApplicationsResult,
  //                 this.selected.selected,
  //                 'DELETE',
  //               );
  //             } else {
  //               this.notificator.showInstantSuccess(
  //                 'VO_DETAIL.APPLICATION.SUCCESS.DELETE_NOTIFICATION',
  //               );
  //             }
  //             this.refreshTable();
  //           },
  //           error: (error: RPCError) => {
  //             this.notificator.showRPCError(error);
  //             this.refreshTable();
  //           },
  //         });
  //     }
  //   });
  // }

  // onResend(): void {
  //   const dialogRef = this.openDialog(
  //     'VO_DETAIL.APPLICATION.DIALOG.RESEND.TITLE',
  //     'VO_DETAIL.APPLICATION.DIALOG.RESEND.DESCRIPTION',
  //     'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.SEND_NOTIFICATION',
  //     'RESEND',
  //     this.selected.selected,
  //     this.currentColumns,
  //   );
  //   dialogRef.afterClosed().subscribe((resendForm: { type: MailType; reason: string }) => {
  //     if (resendForm) {
  //       this.loadingSubject$.next(true);
  //       this.registrarService
  //         .sendMessages({
  //           ids: this.selected.selected.map((app) => app.id),
  //           mailType: resendForm.type,
  //           reason: resendForm.reason,
  //         })
  //         .subscribe({
  //           next: () => {
  //             this.notificator.showInstantSuccess('VO_DETAIL.APPLICATION.SUCCESS.RESEND');
  //             this.refreshTable();
  //           },
  //           error: () => {
  //             this.loadingSubject$.next(false);
  //           },
  //         });
  //     }
  //   });
  // }

  statesChanged(states: AppState[]): void {
    this.currentStates = states;
    if (states === null) {
      this.currentStates = ['NEW', 'VERIFIED', 'APPROVED', 'REJECTED'];
    }
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
    downloadApplicationsData(
      getDataForExport(this.applications, this.currentColumns, getExportDataForColumn),
      this.translate,
      a.format,
    );
  }

  // private errorsInBulkOperation(
  //   bulkOperationsResult: [ApplicationOperationResult],
  //   selectedApplications: Application[],
  //   operation: string,
  // ): void {
  //   const resultsMap = new Map<number, PerunException>();
  //   bulkOperationsResult.forEach((res) => {
  //     resultsMap.set(res.applicationId, res.error);
  //   });
  //   const appErrorPairs: [Application, PerunException][] = selectedApplications.map((app) => [
  //     app,
  //     this.addCallToException(resultsMap.get(app.id), this.callMap.get(operation)),
  //   ]);
  //   const groupAppIncluded = selectedApplications.some((app) => app.group !== null);
  //   const config = getDefaultDialogConfig();
  //   config.width = '1300px';
  //   config.data = {
  //     theme: this.theme,
  //     action: operation,
  //     applicationsResults: appErrorPairs,
  //     displayedColumns: groupAppIncluded
  //       ? this.bulkOperationFailureGroupColumns
  //       : this.bulkOperationFailureColumns,
  //   };
  //   this.notificator.showInstantError(
  //     'VO_DETAIL.APPLICATION.ERROR.' + operation + '_NOTIFICATION',
  //     null,
  //     '',
  //     'VO_DETAIL.APPLICATION.SHOW',
  //     () => {
  //       const dialogRef = this.dialog.open(ApplicationsBulkOperationFailureDialogComponent, config);
  //       dialogRef.afterClosed().subscribe((success) => {
  //         if (success) {
  //           this.refreshTable();
  //         }
  //       });
  //     },
  //   );
  // }

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
