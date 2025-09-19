import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { DeleteDialogResult, DeleteEntityDialogComponent } from '@perun-web-apps/perun/dialogs';

export interface DeleteGroupDialogData {
  theme: string;
  voId: number;
  groups: Group[];
}

@Component({
  imports: [CommonModule, DeleteEntityDialogComponent],
  standalone: true,
  selector: 'app-delete-group-dialog',
  templateUrl: './delete-group-dialog.component.html',
  styleUrls: ['./delete-group-dialog.component.scss'],
})
export class DeleteGroupDialogComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Group>;
  theme: string;
  loading = false;
  relations: string[] = [];
  force = false;
  lastVoAdminGroupIds: number[] = [];
  lastFacAdminGroupIds: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteGroupDialogData,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private groupService: GroupsManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;
    this.dataSource = new MatTableDataSource<Group>(this.data.groups);
    this.relations = [
      'DIALOGS.DELETE_GROUP.SUBGROUP_RELATION',
      'DIALOGS.DELETE_GROUP.MEMBER_RELATION',
      'DIALOGS.DELETE_GROUP.RESOURCE_RELATION',
      'DIALOGS.DELETE_GROUP.ROLE_RELATION',
      'DIALOGS.DELETE_GROUP.OTHER_GROUP_RELATION',
      'DIALOGS.DELETE_GROUP.ATTRIBUTE_RELATION',
      'DIALOGS.DELETE_GROUP.SUBGROUP_OTHER_RELATION',
    ].map((key) => this.translate.instant(key) as string);

    this.groupService
      .isGroupLastAdminInSomeVo(this.data.groups.map((group) => group.id))
      .subscribe({
        next: (lastVoAdminGroups) => {
          this.lastVoAdminGroupIds = lastVoAdminGroups.map((group) => group.id);
          this.groupService
            .isGroupLastAdminInSomeFacility(this.data.groups.map((group) => group.id))
            .subscribe({
              next: (lastFacAdminGroups) => {
                this.lastFacAdminGroupIds = lastFacAdminGroups.map((group) => group.id);
                this.loading = false;
              },
              error: () => {
                this.loading = false;
              },
            });
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.loading = true;
    const groups: number[] = this.data.groups.map((elem) => elem.id);
    this.groupService.deleteGroups({ groups: groups, forceDelete: this.force }).subscribe({
      next: () => {
        this.translate.get('DIALOGS.DELETE_GROUP.SUCCESS').subscribe({
          next: (successMessage: string) => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close(true);
          },
          error: () => (this.loading = false),
        });
      },
      error: () => (this.loading = false),
    });
  }

  onSubmit(result: DeleteDialogResult): void {
    this.force = result.force;
    if (result.deleted) {
      this.onDelete();
    } else {
      this.onCancel();
    }
  }
}
