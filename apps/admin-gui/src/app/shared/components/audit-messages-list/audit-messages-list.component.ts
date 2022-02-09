import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { AuditMessage } from '@perun-web-apps/perun/openapi';
import {
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { AuditMessageDetailDialogComponent } from '../dialogs/audit-message-detail-dialog/audit-message-detail-dialog.component';
import {
  CustomMatPaginator,
  DynamicDataSource,
  DynamicPaginatingService,
} from '@perun-web-apps/perun/services';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TableConfigService } from '@perun-web-apps/config/table-config';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-audit-messages-list',
  templateUrl: './audit-messages-list.component.html',
  styleUrls: ['./audit-messages-list.component.scss'],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginator,
    },
  ],
})
export class AuditMessagesListComponent implements OnInit, OnChanges, AfterViewInit {
  dataSource: DynamicDataSource<AuditMessage>;
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @ViewChild(MatSort) sort: MatSort;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input()
  tableId: string;
  @Input()
  refresh: boolean;
  @Input()
  displayedColumns: string[] = ['id', 'timestamp', 'name', 'actor', 'event.message', 'detail'];
  @Input()
  searchString: string;

  constructor(
    private dialog: MatDialog,
    private dynamicPaginatingService: DynamicPaginatingService,
    private tableConfigService: TableConfigService
  ) {}

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.child.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.child.paginator.page)
      .pipe(tap(() => this.loadAuditMessagesPage()))
      .subscribe();
  }

  ngOnInit(): void {
    this.dataSource = new DynamicDataSource<AuditMessage>(this.dynamicPaginatingService, null);
    this.dataSource.loadAuditMessages(
      this.tableConfigService.getTablePageSize(this.tableId),
      0,
      'DESCENDING'
    );
  }

  ngOnChanges() {
    if (this.dataSource) {
      this.child.paginator.pageIndex = 0;
      this.loadAuditMessagesPage();
    }
  }

  loadAuditMessagesPage() {
    const sortDirection = this.sort.direction === 'asc' ? 'ASCENDING' : 'DESCENDING';
    this.dataSource.loadAuditMessages(
      this.child.paginator.pageSize,
      this.child.paginator.pageIndex,
      sortDirection
    );
  }

  viewDetails(auditMessage: AuditMessage) {
    const config = getDefaultDialogConfig();
    const tmp = JSON.parse(JSON.stringify(auditMessage));
    config.minWidth = '700px';
    config.maxWidth = '1000px';
    config.data = {
      message: tmp,
    };
    this.dialog.open(AuditMessageDetailDialogComponent, config);
  }

  exportData(format: string) {
    downloadData(
      getDataForExport(
        this.dataSource.getData(),
        this.displayedColumns.filter((v) => v !== 'detail'),
        this.getExportDataForColumn,
        this
      ),
      format
    );
  }

  getExportDataForColumn(data: AuditMessage, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'timestamp':
        return formatDate(data.createdAt, 'd.M.y H.mm.ss', 'en');
      case 'name':
        return data.event.name.split('.').pop();
      case 'actor':
        return data.actor;
      default:
        return '';
    }
  }
}
