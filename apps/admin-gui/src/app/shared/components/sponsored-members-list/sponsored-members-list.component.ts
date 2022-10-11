import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { AttributesManagerService, MemberWithSponsors, Vo } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
  parseFullName,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { EditMemberSponsorsDialogComponent } from '../dialogs/edit-member-sponsors-dialog/edit-member-sponsors-dialog.component';
import { GuiAuthResolver, StoreService, TableCheckbox } from '@perun-web-apps/perun/services';
import { PasswordResetRequestDialogComponent } from '../dialogs/password-reset-request-dialog/password-reset-request-dialog.component';

@Component({
  selector: 'app-sponsored-members-list',
  templateUrl: './sponsored-members-list.component.html',
  styleUrls: ['./sponsored-members-list.component.scss'],
})
export class SponsoredMembersListComponent implements OnChanges {
  @Input()
  sponsoredMembers: MemberWithSponsors[] = [];
  @Input()
  selection: SelectionModel<MemberWithSponsors>;
  @Input()
  filterValue = '';
  @Input()
  displayedColumns: string[] = ['id', 'name', 'email', 'logins', 'sponsors', 'menu'];

  @Input()
  disableRouting = false;
  @Input()
  tableId: string;
  @Output()
  refreshTable = new EventEmitter<void>();
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  dataSource: MatTableDataSource<MemberWithSponsors>;
  loading = false;
  routingStrategy = false;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  private sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private authResolver: GuiAuthResolver,
    private storeService: StoreService,
    private attributesManager: AttributesManagerService,
    private tableCheckbox: TableCheckbox
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  static getSortDataForColumn(data: MemberWithSponsors, column: string): string {
    switch (column) {
      case 'id':
        return data.member.id.toString();
      case 'name':
        if (data.member.user) {
          return data.member.user.lastName
            ? data.member.user.lastName
            : data.member.user.firstName ?? '';
        }
        return '';
      case 'sponsors':
        return data.sponsors.length.toString();
      default:
        return '';
    }
  }

  static getDataForColumn(data: MemberWithSponsors, column: string): string {
    switch (column) {
      case 'id':
        return data.member.id.toString();
      case 'name':
        if (data.member.user) {
          return parseFullName(data.member.user);
        }
        return '';
      case 'sponsors':
        return data.sponsors.map((s) => parseFullName(s.user)).join();
      default:
        return '';
    }
  }

  ngOnChanges(): void {
    if (!this.authResolver.isPerunAdminOrObserver()) {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.setDataSource();
    this.routingStrategy = this.disableRouting;
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        SponsoredMembersListComponent.getDataForColumn
      ),
      format
    );
  }

  exportDisplayedData(format: string): void {
    const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
    const end = start + this.dataSource.paginator.pageSize;
    downloadData(
      getDataForExport(
        this.dataSource
          .sortData(this.dataSource.filteredData, this.dataSource.sort)
          .slice(start, end),
        this.displayedColumns,
        SponsoredMembersListComponent.getDataForColumn
      ),
      format
    );
  }

  setDataSource(): void {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<MemberWithSponsors>();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: MemberWithSponsors, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          SponsoredMembersListComponent.getDataForColumn
        );
      this.dataSource.sortData = (
        data: MemberWithSponsors[],
        sort: MatSort
      ): MemberWithSponsors[] =>
        customDataSourceSort(data, sort, SponsoredMembersListComponent.getSortDataForColumn);
    }
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.sponsoredMembers;
  }

  showSponsors(member: MemberWithSponsors): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = {
      sponsors: member.sponsors,
      member: member.member,
      theme: 'vo-theme',
    };
    const dialogRef = this.dialog.open(EditMemberSponsorsDialogComponent, config);
    dialogRef.afterClosed().subscribe((edited) => {
      if (edited) {
        this.refreshTable.emit();
      }
    });
  }

  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
  }

  masterToggle(): void {
    this.tableCheckbox.masterToggle(
      this.isAllSelected(),
      this.selection,
      this.filterValue,
      this.dataSource,
      this.sort,
      this.child.paginator.pageSize,
      this.child.paginator.pageIndex,
      false
    );
  }

  checkboxLabel(row?: MemberWithSponsors): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.member.id + 1}`;
  }

  resetPassword(sponsoredMember: MemberWithSponsors): void {
    this.loading = true;
    const attUrns = this.storeService
      .getProperty('password_namespace_attributes')
      .map((urnString) => {
        const urn = urnString.split(':');
        return urn[urn.length - 1];
      });
    this.attributesManager.getLogins(sponsoredMember.member.userId).subscribe(
      (logins) => {
        const filteredLogins = logins.filter((login) =>
          attUrns.includes(login.friendlyNameParameter)
        );

        const config = getDefaultDialogConfig();
        config.width = '400px';
        config.data = {
          userId: sponsoredMember.member.userId,
          memberId: sponsoredMember.member.id,
          logins: filteredLogins,
        };

        const dialogRef = this.dialog.open(PasswordResetRequestDialogComponent, config);

        dialogRef.afterClosed().subscribe(() => {
          this.loading = false;
        });
      },
      () => (this.loading = false)
    );
  }

  passwdResetAuth(sponsoredMember: MemberWithSponsors): boolean {
    const vo: Vo = {
      id: sponsoredMember.member.voId,
      beanName: 'Vo',
    };

    return this.authResolver.isAuthorized(
      'sendPasswordResetLinkEmail_Member_String_String_String_String_policy',
      [vo, sponsoredMember.member]
    );
  }
}
