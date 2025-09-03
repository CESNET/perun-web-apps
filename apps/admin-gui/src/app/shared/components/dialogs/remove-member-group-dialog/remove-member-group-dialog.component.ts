import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface RemoveMemberGroupDialogData {
  theme: string;
  memberId: number;
  groups: Group[];
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    MatTableModule,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-remove-member-group-dialog',
  templateUrl: './remove-member-group-dialog.component.html',
  styleUrls: ['./remove-member-group-dialog.component.scss'],
})
export class RemoveMemberGroupDialogComponent implements OnInit {
  theme: string;
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Group>;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<RemoveMemberGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RemoveMemberGroupDialogData,
    private groupManager: GroupsManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.dataSource = new MatTableDataSource<Group>(this.data.groups);
  }

  onRemove(): void {
    this.loading = true;
    const groupIds = this.dataSource.data.map((group) => group.id);

    this.groupManager.removeMember(groupIds, this.data.memberId).subscribe(
      () => {
        this.notificator.showSuccess(
          this.translate.instant('DIALOGS.REMOVE_MEMBER_GROUP.SUCCESS') as string,
        );
        this.dialogRef.close(true);
      },
      () => (this.loading = false),
    );
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
