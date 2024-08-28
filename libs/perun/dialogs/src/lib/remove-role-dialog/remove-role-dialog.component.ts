import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  AuthzResolverService,
  Facility,
  Group,
  RichResource,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PerunTranslateService } from '@perun-web-apps/perun/services';

export interface RemoveRoleDialogData {
  role: string;
  items: Group[] | Facility[] | RichResource[] | Vo[];
  entityId: number;
  primaryObject?: string;
  theme: string;
}

@Component({
  selector: 'perun-web-apps-remove-role-dialog',
  templateUrl: './remove-role-dialog.component.html',
  styleUrls: ['./remove-role-dialog.component.scss'],
})
export class RemoveRoleDialogComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Group | Facility | RichResource | Vo>;
  loading: boolean;
  theme: string;
  warningMessage: string;
  doLastWarning = false;
  lastIds: number[] = [];
  description: string;

  constructor(
    private dialogRef: MatDialogRef<RemoveRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemoveRoleDialogData,
    private translate: PerunTranslateService,
    private authzService: AuthzResolverService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.description =
      this.data.primaryObject === null
        ? this.translate.instant('DIALOGS.REMOVE_ROLE.DESCRIPTION', { role: this.data.role })
        : this.translate.instant('DIALOGS.REMOVE_ROLE.DESCRIPTION_WITH_OBJECTS', {
            role: this.data.role,
            count: this.data.items.length,
          });
    this.theme = this.data.theme;
    this.dataSource = new MatTableDataSource<Group | Facility | RichResource | Vo>(this.data.items);
    if (this.data.role === 'Organization admin') {
      this.warningMessage = 'DIALOGS.REMOVE_ROLE.WARNING_REMOVE_LAST_VO';
    }
    if (this.data.role === 'Facility admin') {
      this.warningMessage = 'DIALOGS.REMOVE_ROLE.WARNING_REMOVE_LAST_FACILITY';
    }
    if (this.data.role === 'Organization admin') {
      if (this.theme === 'user-theme') {
        this.authzService
          .isUserLastAdminInVos(
            this.data.entityId,
            this.data.items.map((item: Vo) => item.id),
          )
          .subscribe({
            next: (result) => {
              this.lastIds = result.map((item) => item.id);
              this.doLastWarning = this.lastIds.length > 0;
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            },
          });
      } else {
        this.authzService
          .isGroupLastAdminInVos(
            this.data.entityId,
            this.data.items.map((item: Vo) => item.id),
          )
          .subscribe({
            next: (result) => {
              this.lastIds = result.map((item) => item.id);
              this.doLastWarning = this.lastIds.length > 0;
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            },
          });
      }
    } else if (this.data.role === 'Facility admin') {
      if (this.theme === 'user-theme') {
        this.authzService
          .isUserLastAdminInFacilities(
            this.data.entityId,
            this.data.items.map((item: Facility) => item.id),
          )
          .subscribe({
            next: (result) => {
              this.lastIds = result.map((item) => item.id);
              this.doLastWarning = this.lastIds.length > 0;
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            },
          });
      } else {
        this.authzService
          .isGroupLastAdminInFacilities(
            this.data.entityId,
            this.data.items.map((item: Facility) => item.id),
          )
          .subscribe({
            next: (result) => {
              this.lastIds = result.map((item) => item.id);
              this.doLastWarning = this.lastIds.length > 0;
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            },
          });
      }
    } else {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.dialogRef.close(true);
  }
}
