import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { AuthzResolverService, Group, PerunBean } from '@perun-web-apps/perun/openapi';
import { Role } from '@perun-web-apps/perun/models';
import { Urns } from '@perun-web-apps/perun/urns';

export interface RemoveGroupDialogData {
  complementaryObject: PerunBean;
  groups: Group[];
  role: Role;
  theme: string;
  doCheckLastWarning: boolean;
}

@Component({
  selector: 'app-remove-group-manager-dialog',
  templateUrl: './remove-group-manager-dialog.component.html',
  styleUrls: ['./remove-group-manager-dialog.component.scss'],
})
export class RemoveGroupManagerDialogComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Group>;
  loading: boolean;
  theme: string;
  warningMessage: string;
  doLastWarning = false;

  constructor(
    public dialogRef: MatDialogRef<RemoveGroupManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemoveGroupDialogData,
    private notificator: NotificatorService,
    private translate: PerunTranslateService,
    private authzService: AuthzResolverService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.dataSource = new MatTableDataSource<Group>(this.data.groups);
    this.theme = this.data.theme;
    if (this.theme === 'vo-theme') {
      this.warningMessage = 'DIALOGS.REMOVE_GROUPS.WARNING_REMOVE_LAST_VO';
    } else if (this.theme === 'facility-theme') {
      this.warningMessage = 'DIALOGS.REMOVE_GROUPS.WARNING_REMOVE_LAST_FACILITY';
    }
    if (
      this.data.doCheckLastWarning &&
      (this.data.role === Role.VOADMIN || this.data.role === Role.FACILITYADMIN)
    ) {
      this.authzService
        .getAuthzRichAdmins(
          this.data.role.toString(),
          this.data.complementaryObject.id,
          this.data.complementaryObject.beanName,
          [Urns.USER_DEF_ORGANIZATION],
          false,
          true,
        )
        .subscribe({
          next: (directAdmins) => {
            this.doLastWarning = directAdmins.length === 0;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
    } else {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    this.authzService
      .unsetRoleWithGroupComplementaryObject({
        role: this.data.role,
        authorizedGroups: this.data.groups.map((group) => group.id),
        complementaryObject: this.data.complementaryObject,
      })
      .subscribe({
        next: () => {
          this.notificator.showSuccess(this.translate.instant('DIALOGS.REMOVE_GROUPS.SUCCESS'));
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => (this.loading = false),
      });
  }
}
