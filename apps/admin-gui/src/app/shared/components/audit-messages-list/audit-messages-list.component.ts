import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuditMessage, PaginatedAuditMessages } from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuditMessageDetailDialogComponent } from '../dialogs/audit-message-detail-dialog/audit-message-detail-dialog.component';
import { CustomMatPaginator } from '@perun-web-apps/perun/services';
import { DynamicDataSource, isDynamicDataSource, PageQuery } from '@perun-web-apps/perun/models';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

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
export class AuditMessagesListComponent implements AfterViewInit {
  @Input() tableId: string;
  @Input() refresh: boolean;
  @Input() loading: boolean;
  @Input() noMessagesAlert = 'SHARED_LIB.UI.ALERTS.NO_AUDIT_MESSAGES';
  @Input() displayedColumns: string[] = [
    'id',
    'timestamp',
    'name',
    'actor',
    'event.message',
    'detail',
  ];
  @Output() loading$: EventEmitter<Observable<boolean>> = new EventEmitter<Observable<boolean>>();
  @Output() queryChanged = new EventEmitter<PageQuery>();
  @Output() downloadAll = new EventEmitter<{ format: string; length: number }>();

  @ViewChild(TableWrapperComponent, { static: true }) tableWrapper: TableWrapperComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  dataSource: MatTableDataSource<AuditMessage> | DynamicDataSource<AuditMessage>;

  constructor(private dialog: MatDialog) {}

  @Input() set auditMessages(auditMessages: AuditMessage[] | PaginatedAuditMessages) {
    // Initialize data source with first AuditMessage object passed
    // One table instance can NOT alternate between paginated and not paginated messages
    if (!this.dataSource) {
      this.dataSourceInit(auditMessages);
    }

    // Set up data correctly on each change
    const paginated = this.isPaginated(auditMessages);
    if (isDynamicDataSource(this.dataSource) && paginated) {
      this.dataSource.data = auditMessages.data;
      this.dataSource.count = auditMessages.totalCount;
    } else if (!isDynamicDataSource(this.dataSource) && !paginated) {
      this.dataSource.data = auditMessages;
    }
  }

  static getExportDataForColumn(data: AuditMessage, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'timestamp':
        return formatDate(data.createdAt, 'd.M.y H.mm.ss', 'en');
      case 'name':
        return data.event.name.split('.').pop();
      case 'actor':
        return data.actor;
      case 'event.message':
        return data.event.message;
      default:
        return '';
    }
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
  }

  viewDetails(auditMessage: AuditMessage): void {
    const config: MatDialogConfig = getDefaultDialogConfig();
    const tmp: string = JSON.parse(JSON.stringify(auditMessage)) as string;
    config.minWidth = '700px';
    config.maxWidth = '1000px';
    config.data = {
      message: tmp,
    };
    this.dialog.open(AuditMessageDetailDialogComponent, config);
  }

  exportDisplayedData(format: string): void {
    if (isDynamicDataSource(this.dataSource)) {
      downloadData(
        getDataForExport(
          this.dataSource.data,
          this.displayedColumns,
          AuditMessagesListComponent.getExportDataForColumn,
        ),
        format,
      );
    } else {
      const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
      const end = start + this.dataSource.paginator.pageSize;
      downloadData(
        getDataForExport(
          this.dataSource
            .sortData(this.dataSource.filteredData, this.dataSource.sort)
            .slice(start, end),
          this.displayedColumns,
          AuditMessagesListComponent.getExportDataForColumn,
        ),
        format,
      );
    }
  }

  isPaginated(data: AuditMessage[] | PaginatedAuditMessages): data is PaginatedAuditMessages {
    return 'data' in data;
  }

  private dataSourceInit(auditMessages: AuditMessage[] | PaginatedAuditMessages): void {
    const paginated = this.isPaginated(auditMessages);

    // Create data source based on input type
    this.dataSource = paginated
      ? new DynamicDataSource(
          auditMessages.data,
          auditMessages.totalCount,
          this.sort,
          this.tableWrapper.paginator,
        )
      : new MatTableDataSource(auditMessages);

    if (isDynamicDataSource(this.dataSource)) {
      // Subscribe to data source changes and pass them to parent
      this.dataSource.pageQuery$.subscribe((query) => this.queryChanged.emit(query));
    } else {
      // Initialize client-side data source
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.tableWrapper.paginator;
      this.dataSource.filterPredicate = (data: AuditMessage, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          AuditMessagesListComponent.getExportDataForColumn,
          true,
        );
      this.dataSource.sortData = (data: AuditMessage[], sort: MatSort): AuditMessage[] =>
        customDataSourceSort(data, sort, AuditMessagesListComponent.getExportDataForColumn);
    }
  }
}
