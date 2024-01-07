import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Application,
  ApplicationOperationResult,
  AppState,
  Attribute,
  AttributeDefinition,
  Group,
  MailType,
  PerunException,
  RegistrarManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { FormControl } from '@angular/forms';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationsBulkOperationDialogComponent } from '../dialogs/applications-bulk-operation-dialog/applications-bulk-operation-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { RPCError } from '@perun-web-apps/perun/models';
import { ApplicationsBulkOperationFailureDialogComponent } from '../dialogs/applications-bulk-operation-failure-dialog/applications-bulk-operation-failure-dialog.component';

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
  @Input() updateTable: boolean;
  @Output() changeView = new EventEmitter<void>();

  loading$: Observable<boolean>;
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

  prependColumns = ['checkbox', 'id'];
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

  selectedApplications: Application[] = [];

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
    this.loading$ = of(true);
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
    this.loading$ = of(true);
    this.showGroupApps = !!this.group;
    this.onSelectedApplicationsChange([]);
  }

  refreshTable(): void {
    this.refresh = !this.refresh;
    this.cd.detectChanges();
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.cd.detectChanges();
  }

  onApprove(): void {
    const dialogRef = this.openDialog(
      'VO_DETAIL.APPLICATION.DIALOG.APPROVE.TITLE',
      'VO_DETAIL.APPLICATION.DIALOG.APPROVE.DESCRIPTION',
      'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.APPROVE',
      'APPROVE',
      this.selectedApplications,
      this.currentColumns,
    );
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading$ = of(true);
        this.registrarService
          .approveApplications(this.selectedApplications.map((app) => app.id))
          .subscribe({
            next: (approveApplicationsResult: [ApplicationOperationResult]) => {
              if (approveApplicationsResult.some((result) => result.error !== null)) {
                this.errorsInBulkOperation(
                  approveApplicationsResult,
                  this.selectedApplications,
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
      this.selectedApplications,
      this.currentColumns,
    );
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading$ = of(true);
        this.registrarService
          .rejectApplications(this.selectedApplications.map((app) => app.id))
          .subscribe({
            next: (rejectApplicationsResult: [ApplicationOperationResult]) => {
              if (rejectApplicationsResult.some((result) => result.error !== null)) {
                this.errorsInBulkOperation(
                  rejectApplicationsResult,
                  this.selectedApplications,
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
      this.selectedApplications,
      this.currentColumns,
    );
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading$ = of(true);
        this.registrarService
          .deleteApplications(this.selectedApplications.map((app) => app.id))
          .subscribe({
            next: (deleteApplicationsResult: [ApplicationOperationResult]) => {
              if (deleteApplicationsResult.some((result) => result.error !== null)) {
                this.errorsInBulkOperation(
                  deleteApplicationsResult,
                  this.selectedApplications,
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
      this.selectedApplications,
      this.currentColumns,
    );
    dialogRef.afterClosed().subscribe((resendForm: { type: MailType; reason: string }) => {
      if (resendForm) {
        this.loading$ = of(true);
        this.registrarService
          .sendMessages({
            ids: this.selectedApplications.map((app) => app.id),
            mailType: resendForm.type,
            reason: resendForm.reason,
          })
          .subscribe({
            next: () => {
              this.notificator.showInstantSuccess('VO_DETAIL.APPLICATION.SUCCESS.RESEND');
              this.refreshTable();
            },
            error: () => {
              this.loading$ = of(false);
            },
          });
      }
    });
  }

  statesChanged(states: AppState[]): void {
    this.currentStates = states;
    this.cd.detectChanges();
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
    this.cd.detectChanges();
  }

  toggleIncludeGroups(): void {
    this.showGroupApps = !this.showGroupApps;
    this.currentColumns = this.setColumns();
    this.cd.detectChanges();
  }

  onSelectedApplicationsChange(applications: Application[]): void {
    this.selectedApplications = applications;
    const state = this.getSelectedState();
    this.setCanPerform(state);
    this.setButtonsTooltips(state);
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
      () => this.dialog.open(ApplicationsBulkOperationFailureDialogComponent, config),
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
    if (this.selectedApplications.length === 0) return null;

    let state = this.selectedApplications[0].state;
    for (const app of this.selectedApplications) {
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
        this.selectedApplications.length
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
      fedColumnsDisplay: this.configuredFedColumns.map(
        (name) => this.fedAttrs.find((attr) => attr.friendlyName === name)?.displayName || '',
      ),
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
