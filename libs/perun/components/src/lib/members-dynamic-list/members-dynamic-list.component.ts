import {
  AfterViewInit,
  Component,
  Input, OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import { MemberGroupStatus, RichMember, VoMemberStatuses } from '@perun-web-apps/perun/openapi';
import {
  downloadData, getDataForExport,
  getDefaultDialogConfig, parseEmail, parseFullName, parseLogins, parseOrganization,
  TABLE_ITEMS_COUNT_OPTIONS
} from '@perun-web-apps/perun/utils';
import { ChangeMemberStatusDialogComponent, MemberTreeViewDialogComponent } from '@perun-web-apps/perun/dialogs';
import {
  DynamicPaginatingService,
  GuiAuthResolver,
  DynamicDataSource,
  TableCheckbox
} from '@perun-web-apps/perun/services';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TableWrapperComponent } from '@perun-web-apps/perun/utils';
import { TableConfigService } from '@perun-web-apps/config/table-config';

@Component({
  selector: 'perun-web-apps-members-dynamic-list',
  templateUrl: './members-dynamic-list.component.html',
  styleUrls: ['./members-dynamic-list.component.css']
})
export class MembersDynamicListComponent implements AfterViewInit, OnInit, OnChanges {

  constructor(private dialog: MatDialog,
              private authResolver: GuiAuthResolver,
              private tableCheckbox: TableCheckbox,
              private tableConfigService: TableConfigService,
              private dynamicPaginatingService: DynamicPaginatingService) { }

  @ViewChild(TableWrapperComponent, {static: true}) child: TableWrapperComponent;

  @ViewChild(MatSort) sort: MatSort;

  @Input()
  selection: SelectionModel<RichMember>;

  @Input()
  displayedColumns: string[] = ['checkbox', 'id', 'type', 'fullName', 'status', 'groupStatus', 'organization', 'email', 'logins'];

  @Input()
  voId: number;

  @Input()
  groupId: number;

  @Input()
  selectedGroupStatuses: MemberGroupStatus[] = [];

  @Input()
  attrNames: string[];

  @Input()
  searchString: string;

  @Input()
  selectedStatuses: VoMemberStatuses[];

  @Input()
  tableId: string;

  @Input()
  updateTable: boolean;

  dataSource: DynamicDataSource<RichMember>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.child.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.child.paginator.page)
      .pipe(
        tap(() => this.loadMembersPage())
      )
      .subscribe();
  }

  ngOnInit() {
    if (!this.authResolver.isPerunAdminOrObserver()){
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'id');
    }
    this.dataSource = new DynamicDataSource<RichMember>(this.dynamicPaginatingService, this.authResolver);
    this.dataSource.loadMembers(this.voId, this.attrNames,'ASCENDING', 0, this.tableConfigService.getTablePageSize(this.tableId),
      'NAME', this.selectedStatuses, this.searchString, this.groupId, this.selectedGroupStatuses);
  }

  ngOnChanges() {
    if (this.dataSource) {
      this.child.paginator.pageIndex = 0;
      this.loadMembersPage();
    }
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.getData().forEach(row => this.selection.select(row));
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.child.paginator.pageSize;
    return numSelected === numRows;
  }

  checkboxLabel(row?: RichMember): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  changeStatus(event: any, member: RichMember) {
    event.stopPropagation();
    if (member.status === 'INVALID') {
      const config = getDefaultDialogConfig();
      config.width = '500px';
      config.data = {member: member};

      const dialogRef = this.dialog.open(ChangeMemberStatusDialogComponent, config);
      dialogRef.afterClosed().subscribe( success => {
        if (success) {
          this.loadMembersPage();
        }
      });
    }
  }

  loadMembersPage() {
    const sortDirection = this.sort.direction === 'asc' ? 'ASCENDING' : 'DESCENDING';
    const sortColumn = this.sort.active === 'fullName' ? 'NAME' : 'ID';
    this.dataSource.loadMembers(this.voId, this.attrNames, sortDirection, this.child.paginator.pageIndex,
      this.child.paginator.pageSize, sortColumn,  this.selectedStatuses, this.searchString, this.groupId, this.selectedGroupStatuses);
  }

  exportData(format: string) {
    downloadData(getDataForExport(this.dataSource.getData(), this.displayedColumns, this.getExportDataForColumn, this), format);
  }

  getExportDataForColumn(data: RichMember, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'fullName':
        if (data.user) {
          return parseFullName(data.user)
        }
        return ''
      case 'status':
        return data.status;
      case 'groupStatus':
        return data.groupStatus;
      case 'organization':
        return parseOrganization(data);
      case 'email':
        return parseEmail(data);
      case 'logins':
        return parseLogins(data);
      default:
        return '';
    }
  }

  viewMemberGroupTree(event: any, member: RichMember) {
    event.stopPropagation();
    const config = getDefaultDialogConfig();
    config.width = '800px';
    config.data = {member: member, groupId: this.groupId};

    this.dialog.open(MemberTreeViewDialogComponent, config);
  }
}
