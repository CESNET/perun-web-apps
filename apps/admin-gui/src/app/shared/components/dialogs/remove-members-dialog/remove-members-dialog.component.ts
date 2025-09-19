import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  GroupsManagerService,
  MembersManagerService,
  RichMember,
} from '@perun-web-apps/perun/openapi';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface RemoveMembersDialogData {
  theme: string;
  members: RichMember[];
  groupId?: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    MatTableModule,
    TranslateModule,
    UserFullNamePipe,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-remove-members-dialog',
  templateUrl: './remove-members-dialog.component.html',
  styleUrls: ['./remove-members-dialog.component.scss'],
})
export class RemoveMembersDialogComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name'];
  dataSource: MatTableDataSource<RichMember>;
  loading: boolean;
  theme: string;

  constructor(
    public dialogRef: MatDialogRef<RemoveMembersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemoveMembersDialogData,
    private membersService: MembersManagerService,
    private groupService: GroupsManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.dataSource = new MatTableDataSource<RichMember>(this.data.members);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    if (this.data.groupId) {
      this.groupService
        .removeMembersBodyParams({
          group: this.data.groupId,
          members: this.data.members.map((m) => m.id),
        })
        .subscribe({
          next: () => this.onSuccess(),
          error: () => this.onError(),
        });
    } else {
      this.membersService
        .deleteMembersBodyParams({ members: this.data.members.map((m) => m.id) })
        .subscribe({
          next: () => this.onSuccess(),
          error: () => this.onError(),
        });
    }
  }

  onSuccess(): void {
    const message: string = this.data.groupId
      ? (this.translate.instant('DIALOGS.REMOVE_MEMBERS.SUCCESS_GROUP') as string)
      : (this.translate.instant('DIALOGS.REMOVE_MEMBERS.SUCCESS') as string);
    this.notificator.showSuccess(message);
    this.dialogRef.close(true);
    this.loading = false;
  }

  onError(): void {
    this.loading = false;
  }
}
