import { MatTooltip } from '@angular/material/tooltip';
import {
  CheckboxLabelPipe,
  IsAllSelectedPipe,
  MasterCheckboxLabelPipe,
} from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AddEditNotificationDialogComponent } from '../../../shared/components/dialogs/add-edit-notification-dialog/add-edit-notification-dialog.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GuiAuthResolver, NotificatorService, TableCheckbox } from '@perun-web-apps/perun/services';
import {
  ApplicationMail,
  PublicationForGUI,
  RegistrarManagerService,
} from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppMailSendingDisabledPipe } from '@perun-web-apps/perun/pipes';
import { TableConfigService } from '@perun-web-apps/config/table-config';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    UiAlertsModule,
    IsAllSelectedPipe,
    TableWrapperComponent,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatTooltip,
    CheckboxLabelPipe,
    MasterCheckboxLabelPipe,
    AppMailSendingDisabledPipe,
  ],
  standalone: true,
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  applicationMails: ApplicationMail[];
  @Input()
  voId: number;
  @Input()
  groupId: number;
  @Input()
  disableSend = false;
  @Input()
  selection = new SelectionModel<ApplicationMail>(true, []);
  @Input()
  cachedSubject: BehaviorSubject<boolean>;
  @Input()
  tableId: string;
  @Input()
  theme: string;
  @Input()
  loading: boolean;
  @Output()
  selectionChange = new EventEmitter<SelectionModel<ApplicationMail>>();
  @Output() refreshTable = new EventEmitter<void>();
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<ApplicationMail>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  dataSource: MatTableDataSource<ApplicationMail>;
  displayedColumns: string[] = ['select', 'id', 'mailType', 'appType', 'send'];
  unfilteredColumns = this.displayedColumns;
  private sort: MatSort;

  constructor(
    private registrarService: RegistrarManagerService,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private dialog: MatDialog,
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
    private tableConfigService: TableConfigService,
  ) {}

  @Input() set displayColumns(columns: string[]) {
    this.unfilteredColumns = columns;
    if (localStorage.getItem('showIds') !== 'true') {
      columns = columns.filter((column) => column !== 'id');
    }
    this.displayedColumns = columns;
  }

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<PublicationForGUI>(
        this.selection.isMultipleSelection(),
        [],
        true,
        this.selection.compareWith,
      );
      this.cachedSubject?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
        if (value) {
          this.cachedSelection.clear();
        }
      });
    }
    this.watchForIdColumnChanges();
  }

  ngOnChanges(): void {
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.dataSource = new MatTableDataSource<ApplicationMail>(this.applicationMails);
    this.setDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }

  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
  }

  masterToggle(): void {
    this.tableCheckbox.masterToggle(
      this.isAllSelected(),
      this.selection,
      this.cachedSelection,
      '',
      this.dataSource,
      this.sort,
      this.child.paginator.pageSize,
      this.child.paginator.pageIndex,
      false,
    );
  }

  changeSending(applicationMail: ApplicationMail): void {
    if (applicationMail.send) {
      this.registrarService
        .setSendingEnabled({ mails: [applicationMail], enabled: false })
        .subscribe(() => {
          applicationMail.send = false;
          this.notificator.showInstantSuccess('VO_DETAIL.SETTINGS.NOTIFICATIONS.SENDING_DISABLE');
        });
    } else {
      this.registrarService
        .setSendingEnabled({ mails: [applicationMail], enabled: true })
        .subscribe(() => {
          applicationMail.send = true;
          this.notificator.showInstantSuccess('VO_DETAIL.SETTINGS.NOTIFICATIONS.SENDING_ENABLE');
        });
    }
  }

  pageChanged(): void {
    if (this.cachedSelection) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }

  openApplicationMailDetail(applicationMail: ApplicationMail): void {
    const config = getDefaultDialogConfig();
    config.width = '1400px';
    config.height = '700px';
    config.data = {
      theme: this.theme,
      voId: this.voId,
      groupId: this.groupId,
      createMailNotification: false,
      applicationMail: { ...applicationMail },
    };

    const dialog = this.dialog.open(AddEditNotificationDialogComponent, config);
    dialog.afterClosed().subscribe((success) => {
      if (success) {
        this.translate
          .get('VO_DETAIL.SETTINGS.NOTIFICATIONS.EDIT_SUCCESS')
          .subscribe((text: string) => {
            this.notificator.showSuccess(text);
          });
        this.selection.clear();
        this.selectionChange.emit(this.selection);
        this.refreshTable.emit();
      }
    });
  }

  getMailType(applicationMail: ApplicationMail): string {
    let value = '';
    if (
      applicationMail.mailType === undefined ||
      applicationMail.mailType === null ||
      applicationMail.mailType.length === 0
    ) {
      value = '';
    } else {
      this.translate
        .get('VO_DETAIL.SETTINGS.NOTIFICATIONS.MAIL_TYPE_' + applicationMail.mailType)
        .subscribe((text: string) => {
          value = text;
        });
    }
    return value;
  }

  toggle(row: ApplicationMail): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
    this.selectionChange.emit(this.selection);
  }

  private setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
    }
  }

  private watchForIdColumnChanges(): void {
    this.tableConfigService.showIdsChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((showIds) => {
        if (showIds) {
          this.displayedColumns = this.unfilteredColumns;
        } else {
          this.displayedColumns = this.unfilteredColumns.filter((column) => column !== 'id');
        }
      });
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
  }
}
