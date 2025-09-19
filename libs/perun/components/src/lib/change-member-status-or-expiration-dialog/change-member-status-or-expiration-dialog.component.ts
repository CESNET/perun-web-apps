import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RichMember } from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MemberOverviewGroupsComponent } from '../member-overview-groups/member-overview-groups.component';
import { MemberOverviewMembershipComponent } from '../member-overview-membership/member-overview-membership.component';

export interface ChangeMemberStatusOrExpirationDialogData {
  member: RichMember;
  voId?: number;
  groupId?: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
    MemberOverviewGroupsComponent,
    MemberOverviewMembershipComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-change-member-status-or-expiration-dialog',
  templateUrl: './change-member-status-or-expiration-dialog.component.html',
  styleUrls: ['./change-member-status-or-expiration-dialog.component.scss'],
})
export class ChangeMemberStatusOrExpirationDialogComponent implements OnInit {
  theme: string;
  voId: number;
  groupId: number;
  member: RichMember;

  constructor(
    public dialogRef: MatDialogRef<ChangeMemberStatusOrExpirationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangeMemberStatusOrExpirationDialogData,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.groupId ? 'group-theme' : 'vo-theme';
    this.voId = this.data.voId;
    this.groupId = this.data.groupId;
    this.member = this.data.member;
  }

  close(): void {
    this.dialogRef.close();
  }
}
