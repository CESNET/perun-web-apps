import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  Application,
  CantBeApprovedException,
  PerunException,
} from '@perun-web-apps/perun/openapi';
import {
  customDataSourceSort,
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
  getFedValue,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { NotificationDialogComponent } from '@perun-web-apps/perun/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { ApplicationApproveAnywayDialogComponent } from '../dialogs/application-approve-anyway-dialog/application-approve-anyway-dialog.component';

@Component({
  selector: 'app-application-operation-error-list',
  templateUrl: './application-operation-error-list.component.html',
  styleUrls: ['./application-operation-error-list.component.scss'],
})
export class ApplicationOperationErrorListComponent implements AfterViewInit, OnInit {
  @Input()
  appErrorPairs: [Application, PerunException][];
  @Input()
  displayedColumns: string[] = [];
  @Input()
  theme: string;
  @Output()
  selectedApplicationResults = new EventEmitter<[Application, PerunException][]>();
  @Output() updated = new EventEmitter<boolean>();
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  dataSource: MatTableDataSource<[Application, PerunException]>;
  selection = new SelectionModel<[Application, PerunException]>(
    true,
    [],
    true,
    ([app1, exp1], [app2, exp2]) => app1.id === app2.id && exp1.errorId === exp2.errorId,
  );
  cachedSelection = new SelectionModel<[Application, PerunException]>(
    this.selection.isMultipleSelection(),
    [],
    true,
    this.selection.compareWith,
  );
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  clickable = true;
  private sort: MatSort;

  constructor(
    private authResolver: GuiAuthResolver,
    private dialog: MatDialog,
    private tableCheckbox: TableCheckbox,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  static getSortDataForColumn(data: [Application, PerunException], column: string): string {
    const application = data[0];
    const exception = data[1];
    switch (column) {
      case 'id':
        return application.id.toString();
      case 'groupId':
        return application.group?.id.toString() ?? '';
      case 'groupName':
        return application.group?.name ?? '';
      case 'createdAt':
        return application.createdAt;
      case 'createdBy':
        return application.user
          ? application.user.lastName
            ? application.user.lastName
            : application.user.firstName ?? ''
          : application.createdBy.slice(
              application.createdBy.lastIndexOf('=') + 1,
              application.createdBy.length,
            );
      case 'error':
        return exception.name;
      default:
        return '';
    }
  }

  ngOnInit(): void {
    this.clickable = this.displayedColumns.includes('error');
    this.updateDatasource();
    this.selection.changed.subscribe((change) => {
      this.selectedApplicationResults.emit(change.source.selected);
    });
  }

  ngAfterViewInit(): void {
    if (!this.authResolver.isPerunAdminOrObserver()) {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
  }

  updateDatasource(): void {
    this.dataSource = new MatTableDataSource(this.appErrorPairs);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.child.paginator;
    this.dataSource.sortData = (
      data: [Application, PerunException][],
      sort: MatSort,
    ): [Application, PerunException][] =>
      customDataSourceSort(
        data,
        sort,
        ApplicationOperationErrorListComponent.getSortDataForColumn.bind(this) as (
          data: [Application, PerunException],
          column: string,
        ) => string,
      );
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

  openExceptionDetail(data: [Application, PerunException]): void {
    const [application, exception] = data;
    if (exception.name === 'CantBeApprovedException') {
      const config = getDefaultDialogConfig();
      config.width = '600px';
      config.data = {
        err: exception as CantBeApprovedException,
        theme: this.theme,
        application: application,
      };

      const dialogRef = this.dialog.open(ApplicationApproveAnywayDialogComponent, config);
      dialogRef.afterClosed().subscribe((success) => {
        if (success) {
          this.appErrorPairs = this.appErrorPairs.filter(([, error]) => error !== exception);
          this.updateDatasource();
          this.updated.emit(true);
        }
      });
    } else {
      this.dialog.open(NotificationDialogComponent, {
        width: '550px',
        data: { title: exception.name, description: exception.message, type: 'success' },
        autoFocus: false,
      });
    }
  }

  getExportDataForColumn(data: [Application, PerunException], column: string): string {
    const [application, exception] = data;
    switch (column) {
      case 'id':
        return application.id.toString();
      case 'groupId':
        return application.group?.id.toString() ?? '';
      case 'groupName':
        return application.group?.name ?? '';
      case 'createdBy':
        return application.createdBy;
      case 'createdAt':
        return application.createdAt;
      case 'error':
        return exception.name;
      default:
        return getFedValue(application.fedInfo, column);
    }
  }

  exportDisplayedData(format: string): void {
    // dataSource is never dynamic, no need to check
    const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
    const end = start + this.dataSource.paginator.pageSize;
    downloadData(
      getDataForExport(
        this.dataSource
          .sortData(this.dataSource.filteredData, this.dataSource.sort)
          .slice(start, end),
        this.displayedColumns,
        (data, column) => this.getExportDataForColumn(data, column),
      ),
      format,
    );
  }

  exportAllData(format: string): void {
    // dataSource is never dynamic, no need to check
    downloadData(
      getDataForExport(this.dataSource.filteredData, this.displayedColumns, (data, column) =>
        this.getExportDataForColumn(data, column),
      ),
      format,
    );
  }

  toggleRow(row: [Application, PerunException]): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  pageChanged(): void {
    this.tableCheckbox.selectCachedDataOnPage(
      this.dataSource,
      this.selection,
      this.cachedSelection,
      this.selection.compareWith,
    );
  }
}
