import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Attribute,
  AttributesManagerService,
  GroupsManagerService,
  MembersManagerService,
  RichMember,
} from '@perun-web-apps/perun/openapi';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { MatSelectChange } from '@angular/material/select';
import { formatDate } from '@angular/common';
import { Urns } from '@perun-web-apps/perun/urns';
import { iif, mergeMap, of, switchMap } from 'rxjs';

export interface ChangeMemberStatusDialogData {
  member: RichMember;
  voId?: number;
  groupId?: number;
  expirationAttr: Attribute;
}

@Component({
  selector: 'perun-web-apps-change-member-status-dialog',
  templateUrl: './change-member-status-dialog.component.html',
  styleUrls: ['./change-member-status-dialog.component.scss'],
})
export class ChangeMemberStatusDialogComponent implements OnInit {
  loading = false;
  theme: string;
  statuses: string[] = ['VALID', 'INVALID', 'EXPIRED', 'DISABLED'];
  currentStatus: string;
  currentStatusDescription: string;
  newStatus: string;
  changeDescription: string;
  expiration: string;
  expirationRequired: boolean;
  maxDate = new Date();
  minDate = new Date();
  canExtendMembershipGroup = false;
  canExtendMembershipVo = false;

  descriptionTranslations = new Map<string, string>([
    ['VALID', 'DIALOGS.CHANGE_STATUS.VALID_DESCRIPTION'],
    ['INVALID', 'DIALOGS.CHANGE_STATUS.INVALID_DESCRIPTION'],
    ['EXPIRED', 'DIALOGS.CHANGE_STATUS.EXPIRED_DESCRIPTION'],
    ['DISABLED', 'DIALOGS.CHANGE_STATUS.DISABLED_DESCRIPTION'],
    ['VALIDINVALID', 'DIALOGS.CHANGE_STATUS.CHANGE_VALID_TO_INVALID'],
    ['VALIDEXPIRED', 'DIALOGS.CHANGE_STATUS.CHANGE_VALID_TO_EXPIRED'],
    ['VALIDDISABLED', 'DIALOGS.CHANGE_STATUS.CHANGE_VALID_TO_DISABLED'],
    ['NOVALIDVALID', 'DIALOGS.CHANGE_STATUS.CHANGE_NO_VALID_TO_VALID'],
    ['NOVALIDINVALID', 'DIALOGS.CHANGE_STATUS.CHANGE_NO_VALID_TO_INVALID'],
    ['NOVALIDEXPIRED', 'DIALOGS.CHANGE_STATUS.CHANGE_NO_VALID_TO_EXPIRED'],
    ['NOVALIDDISABLED', 'DIALOGS.CHANGE_STATUS.CHANGE_NO_VALID_TO_DISABLED'],
  ]);

  constructor(
    private dialogRef: MatDialogRef<ChangeMemberStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ChangeMemberStatusDialogData,
    private memberManager: MembersManagerService,
    private groupsManager: GroupsManagerService,
    private attributeService: AttributesManagerService,
    private notificatorService: NotificatorService,
    private translate: PerunTranslateService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.data.groupId) {
      this.theme = 'group-theme';
      this.currentStatus = this.data.member.groupStatus;
      this.statuses = ['VALID', 'EXPIRED'];
      this.attributeService
        .getGroupAttributeByName(this.data.groupId, Urns.GROUP_DEF_EXPIRATION_RULES)
        .pipe(
          switchMap((attr) => {
            if (!attr.value) return of(false);
            return this.groupsManager.canExtendMembershipInGroup(
              this.data.member.id,
              this.data.groupId,
            );
          }),
        )
        .subscribe({
          next: (canExtend) => {
            this.canExtendMembershipGroup = Boolean(canExtend);
            this.loading = false;
          },
          error: () => (this.loading = false),
        });
    } else {
      this.theme = 'vo-theme';
      this.currentStatus = this.data.member.status;
      if (this.currentStatus === 'INVALID') {
        this.statuses = ['VALID', 'EXPIRED'];
      }
      this.attributeService
        .getVoAttributeByName(this.data.voId, Urns.VO_DEF_EXPIRATION_RULES)
        .pipe(
          switchMap((attr) => {
            if (!attr.value) return of(false);
            return this.memberManager.canExtendMembership(this.data.member.id);
          }),
        )
        .subscribe({
          next: (canExtend) => {
            this.canExtendMembershipVo = canExtend;
            this.loading = false;
          },
          error: () => (this.loading = false),
        });
    }

    this.statuses = this.statuses.filter((status) => status !== this.currentStatus);
    if (this.statuses.length === 1) {
      this.newStatus = this.statuses[0];
      this.changeStatusMessage();
    }

    this.resetExpiration();
    this.setDateBounds();
    this.currentStatusDescription = this.translate.instant(
      this.descriptionTranslations.get(this.currentStatus),
    );
  }

  changeStatus(event: MatSelectChange): void {
    this.newStatus = event.value as string;

    this.setDateBounds();
    this.resetExpiration();
    this.changeStatusMessage();
  }

  setExpiration(newExpiration: string): void {
    this.expiration = newExpiration;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.loading = true;
    this.data.expirationAttr.value = this.expiration === 'never' ? null : this.expiration;
    const extend$ = this.memberManager.extendMembership(this.data.member.id);
    const change$ = this.attributeService.setMemberAttribute({
      member: this.data.member.id,
      attribute: this.data.expirationAttr,
    });

    if (this.data.groupId === null || this.data.groupId === undefined) {
      this.memberManager.setStatus(this.data.member.id, this.newStatus).subscribe({
        next: (member) => {
          of(this.expiration)
            .pipe(mergeMap((exp) => iif(() => exp === 'voRules', extend$, change$)))
            .subscribe({
              next: () => {
                this.loading = false;
                this.notificatorService.showInstantSuccess('DIALOGS.CHANGE_STATUS.SUCCESS');
                this.dialogRef.close(member);
              },
              error: () => (this.loading = false),
            });
        },
        error: () => (this.loading = false),
      });
    } else {
      const extendGroup$ = this.groupsManager.extendMembershipInGroup(
        this.data.member.id,
        this.data.groupId,
      );
      const changeGroup$ = this.attributeService.setMemberGroupAttribute({
        member: this.data.member.id,
        group: this.data.groupId,
        attribute: this.data.expirationAttr,
      });
      this.groupsManager
        .setGroupsMemberStatus(this.data.member.id, this.data.groupId, this.newStatus)
        .subscribe({
          next: (member) => {
            of(this.expiration)
              .pipe(mergeMap((exp) => iif(() => exp === 'groupRules', extendGroup$, changeGroup$)))
              .subscribe({
                next: () => {
                  this.loading = false;
                  this.notificatorService.showInstantSuccess('DIALOGS.CHANGE_STATUS.SUCCESS');
                  this.dialogRef.close(member);
                },
                error: () => (this.loading = false),
              });
          },
          error: () => (this.loading = false),
        });
    }
  }

  private changeStatusMessage(): void {
    let val = this.currentStatus;
    if (this.currentStatus !== 'VALID') {
      val = 'NOVALID';
    }

    this.changeDescription = this.translate.instant(
      this.descriptionTranslations.get(val + this.newStatus),
    );
  }

  private setDateBounds(): void {
    if (this.newStatus === 'VALID') {
      this.minDate = new Date();
      this.maxDate = null;
    } else if (this.newStatus === 'EXPIRED') {
      this.minDate = null;
      this.maxDate = new Date();
    }
  }

  private resetExpiration(): void {
    this.expirationRequired = this.newStatus === 'VALID' || this.newStatus === 'EXPIRED';
    if (this.newStatus === 'EXPIRED') {
      this.expiration = formatDate(new Date(), 'yyyy-MM-dd', 'en-GB');
    } else {
      this.expiration = 'never';
    }
  }
}
