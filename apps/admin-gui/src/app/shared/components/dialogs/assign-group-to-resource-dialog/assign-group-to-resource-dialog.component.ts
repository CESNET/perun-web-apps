import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { Group, GroupsManagerService, Resource, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import {
  TABLE_ASSIGN_GROUP_TO_RESOURCE_DIALOG,
  TableConfigService
} from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';

export interface AssignGroupToResourceDialogData {
  theme: string;
  resourceId: number;
}

@Component({
  selector: 'app-perun-web-apps-assign-group-to-resource-dialog',
  templateUrl: './assign-group-to-resource-dialog.component.html',
  styleUrls: ['./assign-group-to-resource-dialog.component.scss']
})
export class AssignGroupToResourceDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AssignGroupToResourceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AssignGroupToResourceDialogData,
              private notificator: NotificatorService,
              private translate: TranslateService,
              private resourceManager: ResourcesManagerService,
              private tableConfigService: TableConfigService,
              private groupService: GroupsManagerService) { }

  loading = false;
  theme: string;

  resource: Resource;
  unAssignedGroups: Group[];
  filteredGroups: Group[];
  checkGroups = false;
  selection = new SelectionModel<Group>(true, []);

  tableId = TABLE_ASSIGN_GROUP_TO_RESOURCE_DIALOG;
  pageSize: number;

  ngOnInit() {
    this.loading = true;
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.theme = this.data.theme;
    this.resourceManager.getResourceById(this.data.resourceId).subscribe( resource => {
      this.resource = resource;
      this.resourceManager.getAssignedGroups(this.resource.id).subscribe( assignedGroups => {
        this.groupService.getAllGroups(this.resource.voId).subscribe( allGroups => {
          this.unAssignedGroups = allGroups;
          for (const assignedGroup of assignedGroups) {
            for (const allGroup of allGroups) {
              if (assignedGroup.id === allGroup.id) {
                this.unAssignedGroups.splice(this.unAssignedGroups.indexOf(allGroup), 1);
              }
            }
          }
          this.filteredGroups = this.unAssignedGroups;
          this.loading = false;
        });
      });
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onAdd() {
    if (this.checkGroups) {
      //TODO when checkbox is checked
    } else {
      this.loading = true;
      const addedGroups: number[] =[];
      for (const group of this.selection.selected) {
        addedGroups.push(group.id);
      }
    this.resourceManager.assignGroupsToResource(addedGroups, this.resource.id).subscribe( () => {
        this.translate.get('DIALOGS.ASSIGN_GROUP_TO_RESOURCE.SUCCESS_MESSAGE').subscribe( message => {
          this.notificator.showSuccess(message);
          this.dialogRef.close(true);
        });
      });
    }
  }

  applyFilter(filterValue: string) {
    this.filteredGroups = this.unAssignedGroups.filter( option => option.name.toLowerCase().includes(filterValue.toLowerCase()));
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
