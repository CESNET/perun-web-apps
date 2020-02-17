import { Component, HostBinding, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { CreateRelationDialogComponent } from '../../../../../shared/components/dialogs/create-relation-dialog/create-relation-dialog.component';
import { RemoveRelationDialogComponent } from '../../../../../shared/components/dialogs/remove-relation-dialog/remove-relation-dialog.component';

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
    private dialog: MatDialog
  ) { }

  selection = new SelectionModel<Group>(true, []);
  groups: Group[] = [];
  groupId: number;
  voId: number;

  reverse = false;
  loading: boolean;
  filterValue = '';

  ngOnInit() {
    this.route.parent.parent.params.subscribe(params => {
      this.groupId = params['groupId'];
      this.voId = params['voId'];

      this.refreshTable();
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateRelationDialogComponent, {
      width: '1050px',
      data: {
        groups: this.groups,
        theme: 'group-theme',
        groupId: +this.groupId,
        voId: this.voId,
        reverse: this.reverse
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(RemoveRelationDialogComponent, {
      width: '450px',
      data: {
        groups: this.selection.selected,
        theme: 'group-theme',
        groupId: +this.groupId,
        reverse: this.reverse
      }
    });

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
}
