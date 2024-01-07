import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Application, PerunException } from '@perun-web-apps/perun/openapi';
import {
  customDataSourceSort,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { ExceptionDetailDialogComponent } from '@perun-web-apps/perun/dialogs';
import { MatDialog } from '@angular/material/dialog';

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
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  dataSource: MatTableDataSource<[Application, PerunException]>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  clickable = true;
  private sort: MatSort;

  constructor(
    private authResolver: GuiAuthResolver,
    private dialog: MatDialog,
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

  ngAfterViewInit(): void {
    if (!this.authResolver.isPerunAdminOrObserver()) {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
  }

  openExceptionDetail(exception: PerunException): void {
    this.dialog.open(ExceptionDetailDialogComponent, {
      width: '550px',
      data: { error: exception, theme: this.theme },
      autoFocus: false,
    });
  }
}
