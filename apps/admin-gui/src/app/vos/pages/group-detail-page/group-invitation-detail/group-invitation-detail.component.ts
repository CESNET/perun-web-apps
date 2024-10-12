import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  Application,
  Group,
  InvitationsManagerService,
  InvitationStatus,
  InvitationWithSender,
  MembersManagerService,
  RichUser,
  UsersManagerService,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { SelectedPendingInvitation } from '@perun-web-apps/perun/pipes';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { InvitationExtendDateDialogComponent } from '../../../../shared/components/dialogs/invitation-extend-date-dialog/invitation-extend-date-dialog.component';
import { InvitationRevokeDialogComponent } from '../../../../shared/components/dialogs/invitation-revoke-dialog/invitation-revoke-dialog.component';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-group-invitation-detail',
  templateUrl: './group-invitation-detail.component.html',
  styleUrls: ['./group-invitation-detail.component.scss'],
  providers: [SelectedPendingInvitation],
})
export class GroupInvitationDetailComponent implements OnInit {
  InvitationStatus = InvitationStatus;
  invitation: InvitationWithSender;
  vo: Vo;
  group: Group;
  application: Application = null;
  senderName: string = '';
  modifierName: string = '';
  creatorName: string = '';
  loading = true;
  invitationId: number;
  senderIdInVo: number;
  authRights = {
    revoke: false,
    extend: false,
  };

  constructor(
    private authResolver: GuiAuthResolver,
    private route: ActivatedRoute,
    private invitationManager: InvitationsManagerService,
    private voManager: VosManagerService,
    private entityStorageService: EntityStorageService,
    private userManager: UsersManagerService,
    private dialog: MatDialog,
    private membersService: MembersManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.group = this.entityStorageService.getEntity();
    this.setAuthRights();
    this.route.params.subscribe((params) => {
      this.invitationId = Number(params['invitationId']);
      this.invitationManager.getInvitationById(this.invitationId).subscribe({
        next: (result: InvitationWithSender) => {
          this.invitation = result;

          this.voManager.getVoById(this.invitation.voId).subscribe({
            next: (resultVo: Vo) => {
              this.vo = resultVo;

              this.userManager.getRichUserWithAttributes(this.invitation.senderId).subscribe({
                next: (resultSender: RichUser) => {
                  this.senderName = this.nameFromRichUser(resultSender);

                  this.userManager
                    .getRichUserWithAttributes(this.invitation.createdByUid)
                    .subscribe({
                      next: (resultCreatedBy: RichUser) => {
                        this.creatorName = this.nameFromRichUser(resultCreatedBy);

                        this.membersService
                          .getMemberByUser(resultVo.id, resultSender.id)
                          .subscribe({
                            next: (resultMember) => {
                              this.senderIdInVo = resultMember.id;

                              // Expired invitation check
                              if (
                                this.invitation.modifiedByUid < 0 ||
                                this.invitation.status === InvitationStatus.EXPIRED
                              ) {
                                this.modifierName = 'Expiration';
                                this.loading = false;
                              } else {
                                this.userManager
                                  .getRichUserWithAttributes(this.invitation.modifiedByUid)
                                  .subscribe({
                                    next: (resultModifiedBy: RichUser) => {
                                      this.modifierName = this.nameFromRichUser(resultModifiedBy);
                                      this.loading = false;
                                    },
                                    error: () => (this.loading = false),
                                  });
                              }
                            },
                            error: () => (this.loading = false),
                          });
                      },
                      error: () => (this.loading = false),
                    });
                },
                error: () => (this.loading = false),
              });
            },
            error: () => (this.loading = false),
          });
        },
        error: () => (this.loading = false),
      });
    });
  }

  nameFromRichUser(user: RichUser): string {
    return (
      user.firstName.toString() +
      ' ' +
      (user.middleName == null ? '' : user.middleName.toString()) +
      user.lastName.toString()
    );
  }

  onInvitationRevoke(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      invitations: [this.invitation],
    };
    const dialogRef = this.dialog.open(InvitationRevokeDialogComponent, config);

    dialogRef.afterClosed().subscribe((isRevoked) => {
      if (isRevoked) {
        this.invitationManager.getInvitationById(this.invitationId).subscribe({
          next: (result: InvitationWithSender) => {
            this.invitation = result;
          },
          error: () => (this.loading = false),
        });
      }
    });
  }

  onInvitationExtendDate(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      invitation: this.invitation,
      theme: 'group-theme',
    };
    const dialogRef = this.dialog.open(InvitationExtendDateDialogComponent, config);

    dialogRef.afterClosed().subscribe((isExtended) => {
      if (isExtended) {
        this.invitationManager.getInvitationById(this.invitationId).subscribe({
          next: (result: InvitationWithSender) => {
            this.invitation = result;
          },
          error: () => (this.loading = false),
        });
      }
    });
  }

  private setAuthRights(): void {
    this.authRights.revoke = this.authResolver.isAuthorized('revokeInvitationById_int_policy', [
      this.group,
    ]);
    this.authRights.extend = this.authResolver.isAuthorized(
      'extendInvitationExpiration_Invitation_LocalDate_policy',
      [this.group],
    );
  }
}
