import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { RichUser } from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  parseFullName,
  parseLogins,
  parseUserEmail,
  parseVo,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, StoreService, TableCheckbox } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnChanges {
  constructor(
    public authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private storeService: StoreService
  ) {}

  svgIcon = 'perun-service-identity-black';

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  @Input()
  users: RichUser[];

  private sort: MatSort;

  @Input()
  selection = new SelectionModel<RichUser>(true, []);

  @Input()
  displayedColumns: string[] = ['select', 'user', 'id', 'name', 'email', 'logins', 'organization'];

  @Input()
  routeToAdmin = true;

  @Input()
  disableRouting = false;

  @Input()
  filter = '';

  @Input()
  tableId: string;

  @Input()
  noUsersFoundLabel: string;

  @Input()
  disableSelf = false;

  dataSource: MatTableDataSource<RichUser>;
  principalId: number;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  getDataForColumn(data: RichUser, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'user':
        return data.serviceUser ? 'true' : 'false';
      case 'name':
        if (data) {
          return data.lastName ? data.lastName : data.firstName ?? '';
        }
        return '';
      case 'organization':
        return parseVo(data);
      case 'email':
        return parseUserEmail(data);
      case 'logins':
        return parseLogins(data);
      default:
        return '';
    }
  }

  getExportDataForColumn(data: RichUser, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'user':
        return data.serviceUser ? 'service-user' : 'user';
      case 'name':
        if (data) {
          return parseFullName(data);
        }
        return '';
      case 'organization':
        return parseVo(data);
      case 'email':
        return parseUserEmail(data);
      case 'logins':
        return parseLogins(data);
      default:
        return '';
    }
  }

  exportData(format: string) {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        this.getExportDataForColumn,
        this
      ),
      format
    );
  }

  setDataSource() {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<RichUser>();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: RichUser, filter: string) =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          this.getDataForColumn,
          this
        );
      this.dataSource.sortData = (data: RichUser[], sort: MatSort) =>
        customDataSourceSort(data, sort, this.getDataForColumn, this);
    }
    this.dataSource.filter = this.filter;
    this.dataSource.data = this.users;
  }

  ngOnChanges() {
    this.principalId = this.storeService.getPerunPrincipal().userId;
    if (!this.authResolver.isPerunAdminOrObserver()) {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.setDataSource();
  }

  isAllSelected() {
    return this.tableCheckbox.isAllSelected(
      this.selection.selected.length,
      this.filter,
      this.child.paginator.pageSize,
      this.child.paginator.hasNextPage(),
      this.dataSource
    );
  }

  masterToggle() {
    this.tableCheckbox.masterToggle(
      this.isAllSelected(),
      this.selection,
      this.filter,
      this.dataSource,
      this.sort,
      this.child.paginator.pageSize,
      this.child.paginator.pageIndex,
      false
    );
  }

  checkboxLabel(row?: RichUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
