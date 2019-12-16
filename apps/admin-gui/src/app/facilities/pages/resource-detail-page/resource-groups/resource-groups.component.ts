import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourcesService } from '@perun-web-apps/perun/services';
import { Group } from '@perun-web-apps/perun/models';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox, MatDialog } from '@angular/material';
import { RemoveGroupFromResourceDialogComponent } from '../../../../shared/components/dialogs/remove-group-from-resource-dialog/remove-group-from-resource-dialog.component';

@Component({
  selector: 'app-perun-web-apps-resource-groups',
  templateUrl: './resource-groups.component.html',
  styleUrls: ['./resource-groups.component.scss']
})
export class ResourceGroupsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private resourcesService: ResourcesService,
              private dialog: MatDialog) { }

  resourceId: number;
  assignedGroups: Group[] = [];
  selected = new SelectionModel<Group>(true, []);
  loading: boolean;
  filteredGroups: Group[] = [];

  @ViewChild('checkbox', {static: true})
  checkbox: MatCheckbox;

  ngOnInit() {
    this.loading = true;
    this.route.parent.params.subscribe(parentParams => {
      this.resourceId = parentParams['resourceId'];
        this.loadAllGroups();
    });
  }

  loadAllGroups() {
    this.loading = true;
    this.resourcesService.getAssignedGroups(this.resourceId).subscribe( assignedGroups => {
      this.assignedGroups = assignedGroups;
      this.filteredGroups = assignedGroups;
      this.selected.clear();
      this.loading = false;
    });
  }

  addGroup() {
    console.log('dorobit');
  }

  removeGroups() {
    const dialogRef = this.dialog.open(RemoveGroupFromResourceDialogComponent, {
      width: '500px',
      data: {resourceId: this.resourceId, groups: this.selected.selected}
    });
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.loadAllGroups();
      }
    });
  }

  applyFilter(filterValue: string) {
    this.filteredGroups = this.assignedGroups.filter( option => option.name.toLowerCase().includes(filterValue.toLowerCase()));
  }
}
