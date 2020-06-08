import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { CreateRelationDialogComponent } from '../../../../../shared/components/dialogs/create-relation-dialog/create-relation-dialog.component';
import { RemoveRelationDialogComponent } from '../../../../../shared/components/dialogs/remove-relation-dialog/remove-relation-dialog.component';
import {
  TABLE_GROUP_SETTINGS_RELATIONS,
  TableConfigService
} from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-group-settings-relations',
  templateUrl: './group-settings-relations.component.html',
  styleUrls: ['./group-settings-relations.component.scss']
})
export class GroupSettingsRelationsComponent implements OnInit {
  @HostBinding('class.router-component') true;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupsManagerService,
    private tableConfigService: TableConfigService,
    private dialog: MatDialog
  ) { }

  selection = new SelectionModel<Group>(true, []);
  groups: Group[] = [];
  groupId: number;
  voId: number;

  reverse = false;
  loading: boolean;
  filterValue = '';

  tableId = TABLE_GROUP_SETTINGS_RELATIONS;
  pageSize: number;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.route.parent.parent.params.subscribe(params => {
      this.groupId = params['groupId'];
      this.voId = params['voId'];

      this.refreshTable();
    });
  }

  onCreate() {
    const config = getDefaultDialogConfig();
    config.width = '1050px';
    config.data = {
      groups: this.groups,
      theme: 'group-theme',
      groupId: +this.groupId,
      voId: this.voId,
      reverse: this.reverse
    };

    const dialogRef = this.dialog.open(CreateRelationDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onDelete() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      groups: this.selection.selected,
      theme: 'group-theme',
      groupId: +this.groupId,
      reverse: this.reverse
    };

    const dialogRef = this.dialog.open(RemoveRelationDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable() {
    this.loading = true;
    this.groupService.getGroupUnions(this.groupId, this.reverse).subscribe(groups => {
      this.groups = groups;
      this.selection.clear();
      this.loading = false;
    }, () => this.loading = false);
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  showReverseUnions() {
    this.reverse = !this.reverse;
    this.refreshTable();
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
