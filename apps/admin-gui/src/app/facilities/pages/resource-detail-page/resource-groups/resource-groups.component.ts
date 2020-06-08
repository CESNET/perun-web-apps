import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { RemoveGroupFromResourceDialogComponent } from '../../../../shared/components/dialogs/remove-group-from-resource-dialog/remove-group-from-resource-dialog.component';
import { AssignGroupToResourceDialogComponent } from '../../../../shared/components/dialogs/assign-group-to-resource-dialog/assign-group-to-resource-dialog.component';
import {
  TABLE_RESOURCE_ALLOWED_GROUPS,
  TableConfigService
} from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-perun-web-apps-resource-groups',
  templateUrl: './resource-groups.component.html',
  styleUrls: ['./resource-groups.component.scss']
})
export class ResourceGroupsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private resourcesManager: ResourcesManagerService,
              private tableConfigService: TableConfigService,
              private dialog: MatDialog) { }

  resourceId: number;
  assignedGroups: Group[] = [];
  selected = new SelectionModel<Group>(true, []);
  loading: boolean;
  filteredGroups: Group[] = [];

  tableId = TABLE_RESOURCE_ALLOWED_GROUPS;
  pageSize: number;

  @ViewChild('checkbox', {static: true})
  checkbox: MatCheckbox;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.loading = true;
    this.route.parent.params.subscribe(parentParams => {
      this.resourceId = parentParams['resourceId'];
        this.loadAllGroups();
    });
  }

  loadAllGroups() {
    this.loading = true;
    this.resourcesManager.getAssignedGroups(this.resourceId).subscribe( assignedGroups => {
      this.assignedGroups = assignedGroups;
      this.filteredGroups = assignedGroups;
      this.selected.clear();
      this.loading = false;
    });
  }

  addGroup() {
    const config = getDefaultDialogConfig();
    config.width = '800px';
    config.data = {theme: 'resource-theme', resourceId: this.resourceId};

    const dialogRef = this.dialog.open(AssignGroupToResourceDialogComponent, config);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.loadAllGroups();
      }
    });
  }

  removeGroups() {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {resourceId: this.resourceId, groups: this.selected.selected};

    const dialogRef = this.dialog.open(RemoveGroupFromResourceDialogComponent, config);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.loadAllGroups();
      }
    });
  }

  applyFilter(filterValue: string) {
    this.filteredGroups = this.assignedGroups.filter( option => option.name.toLowerCase().includes(filterValue.toLowerCase()));
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
