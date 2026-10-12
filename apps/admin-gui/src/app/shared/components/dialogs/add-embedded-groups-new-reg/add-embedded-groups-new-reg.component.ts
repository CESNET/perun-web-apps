import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DebounceFilterComponent, GroupsListComponent } from '@perun-web-apps/perun/components';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface AddEmbeddedGroupsNewRegDialogData {
  theme: string;
  /** VO id (for VO objects) or GROUP id (for GROUP objects). */
  entityId: number;
  entityType: 'VO' | 'GROUP';
  assignedGroupIds: number[];
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    DebounceFilterComponent,
    TranslateModule,
    LoaderDirective,
    GroupsListComponent,
  ],
  standalone: true,
  selector: 'app-add-embedded-groups-new-reg',
  templateUrl: './add-embedded-groups-new-reg.component.html',
  styleUrls: ['./add-embedded-groups-new-reg.component.scss'],
})
export class AddEmbeddedGroupsNewRegComponent implements OnInit {
  loading = false;
  theme: string;
  unAssignedGroups: Group[] = [];
  selection: SelectionModel<Group> = new SelectionModel<Group>(
    true,
    [],
    true,
    (group1, group2) => group1.id === group2.id,
  );
  filterValue = '';

  constructor(
    public dialogRef: MatDialogRef<AddEmbeddedGroupsNewRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEmbeddedGroupsNewRegDialogData,
    private groupService: GroupsManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;
    const groups$ =
      this.data.entityType === 'VO'
        ? this.groupService.getAllGroups(this.data.entityId)
        : this.groupService.getAllSubGroups(this.data.entityId);
    groups$.subscribe({
      next: (groups) => {
        this.unAssignedGroups = groups.filter(
          (group) => !this.data.assignedGroupIds.includes(group.id),
        );
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }

  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  onAdd(): void {
    this.dialogRef.close(this.selection.selected);
  }
}
