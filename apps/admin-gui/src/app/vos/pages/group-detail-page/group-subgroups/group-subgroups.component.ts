import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../../../../shared/components/dialogs/create-group-dialog/create-group-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteGroupDialogComponent } from '../../../../shared/components/dialogs/delete-group-dialog/delete-group-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { applyFilter, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { TABLE_GROUP_SUBGROUPS, TableConfigService } from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-group-subgroups',
  templateUrl: './group-subgroups.component.html',
  styleUrls: ['./group-subgroups.component.scss']
})
export class GroupSubgroupsComponent implements OnInit {

  static id = 'GroupSubgroupsComponent';

  // used for router animation
  @HostBinding('class.router-component') true;

  constructor(
    private dialog: MatDialog,
    private groupService: GroupsManagerService,
    private tableConfigService: TableConfigService,
    private route: ActivatedRoute
  ) {
  }
  group: Group;
  groups: Group[] = [];
  filteredGroups: Group[] = [];
  filteredTreeGroups: Group[] = [];
  selected = new SelectionModel<Group>(true, []);
  showGroupList = false;
  loading: boolean;
  filtering = false;
  tableId = TABLE_GROUP_SUBGROUPS;
  pageSize: number;

  @ViewChild('checkbox', {static: true})
  checkbox: MatCheckbox;

  onCreateGroup() {
    const config = getDefaultDialogConfig();
    config.width = '350px';
    config.data = {parentGroup: this.group};

    const dialogRef = this.dialog.open(CreateGroupDialogComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    if (localStorage.getItem('preferedValue') === 'list') {
      this.checkbox.toggle();
      this.selected.clear();
      this.showGroupList = true;
    }
    this.checkbox.change.subscribe(() => {
      const value = this.checkbox.checked ? 'list' : 'tree';
      localStorage.setItem('preferedValue', value);
    });

    this.route.parent.params.subscribe(parentParams => {
      const groupId = parentParams['groupId'];
      this.groupService.getGroupById(groupId).subscribe(group => {
        // @ts-ignore
        this.group = group;

        this.refreshTable();
      });
    });
  }

  deleteGroup() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {voId: this.group.id, groups: this.selected.selected};

    const dialogRef = this.dialog.open(DeleteGroupDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable() {
    this.loading = true;
    this.groupService.getAllRichSubGroupsWithGroupAttributesByNames(this.group.id, [Urns.GROUP_DEF_MAIL_FOOTER]).subscribe(groups => {
      this.groups = groups;
      this.filteredTreeGroups = this.groups;
      this.filteredGroups = this.groups;
      this.selected.clear();
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    const results = applyFilter(filterValue, this.groups);
    this.filteredGroups = results[0];
    this.filteredTreeGroups = results[1];
    this.filtering = filterValue !== '';
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
