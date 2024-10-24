import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationReSendNotificationDialogComponent } from '../../../shared/components/dialogs/application-re-send-notification-dialog/application-re-send-notification-dialog.component';
import { ApplicationRejectDialogComponent } from '../../../shared/components/dialogs/application-reject-dialog/application-reject-dialog.component';
import { GuiAuthResolver, NotificatorService } from '@perun-web-apps/perun/services';
import {
  Application,
  ApplicationFormItemData,
  Invitation,
  InvitationsManagerService,
  MembersManagerService,
  RegistrarManagerService,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { EditApplicationFormItemDataDialogComponent } from '../../../shared/components/dialogs/edit-application-form-item-data-dialog/edit-application-form-item-data-dialog.component';
import { UniversalConfirmationItemsDialogComponent } from '@perun-web-apps/perun/dialogs';

@Component({
  selector: 'app-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss'],
})
export class ApplicationDetailComponent implements OnInit {
  // used for router animation
  @HostBinding('class.router-component') true;
  application: Application;
  userData: ApplicationFormItemData[] = [];
  userMail: string;
  displayedColumns: string[] = ['label', 'value'];
  dataSource: MatTableDataSource<ApplicationFormItemData>;
  loading = true;
  dialogTheme: string;
  verifyAuth: boolean;
  approveAuth: boolean;
  rejectAuth: boolean;
  deleteAuth: boolean;
  resendAuth: boolean;
  invitation: Invitation = null;

  constructor(
    private registrarManager: RegistrarManagerService,
    private invitationsManager: InvitationsManagerService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private notificator: NotificatorService,
    private router: Router,
    private authResolver: GuiAuthResolver,
    private usersService: UsersManagerService,
    private membersService: MembersManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.route.parent.params.subscribe((parentParams) => {
        if (parentParams['groupId']) {
          this.dialogTheme = 'group-theme';
        } else if (parentParams['memberId']) {
          this.dialogTheme = 'member-theme';
        } else {
          this.dialogTheme = 'vo-theme';
        }
        const applicationId = Number(params['applicationId']);
        this.registrarManager.getApplicationById(applicationId).subscribe((application) => {
          this.application = application;
          if (this.application.type === 'EMBEDDED' && this.application.user) {
            this.usersService
              .getRichUserWithAttributes(this.application.user.id)
              .subscribe((user) => {
                const preferredMail = user.userAttributes.find(
                  (att) => att.friendlyName === 'preferredMail',
                );
                this.userMail = preferredMail?.value as string;
                this.setAuthRights();
                this.loading = false;
              });
          } else {
            this.registrarManager.getApplicationDataById(this.application.id).subscribe((value) => {
              this.userData = value;
              this.dataSource = new MatTableDataSource<ApplicationFormItemData>(this.userData);
              this.setAuthRights();
              if (this.application.group && this.application.state === 'APPROVED') {
                this.invitationsManager.getInvitationByApplication(this.application.id).subscribe({
                  next: (invitation) => {
                    this.invitation = invitation;
                    this.loading = false;
                  },
                  error: () => {
                    this.loading = false;
                  },
                });
              } else {
                this.loading = false;
              }
            });
          }
        });
      });
    });
  }

  setAuthRights(): void {
    if (this.dialogTheme === 'group-theme') {
      this.verifyAuth = this.authResolver.isAuthorized('group-verifyApplication_int_policy', [
        this.application.group,
      ]);
      this.approveAuth = this.authResolver.isAuthorized(
        'group-approveApplicationInternal_int_policy',
        [this.application.group],
      );
      this.rejectAuth = this.authResolver.isAuthorized(
        'group-rejectApplication_int_String_policy',
        [this.application.group],
      );
      this.deleteAuth = this.authResolver.isAuthorized(
        'group-deleteApplication_Application_policy',
        [this.application.group],
      );
      this.resendAuth = this.authResolver.isAuthorized(
        'group-sendMessage_Application_MailType_String_policy',
        [this.application.group],
      );
    } else {
      this.verifyAuth = this.authResolver.isAuthorized('vo-verifyApplication_int_policy', [
        this.application.vo,
      ]);
      this.approveAuth = this.authResolver.isAuthorized(
        'vo-approveApplicationInternal_int_policy',
        [this.application.vo],
      );
      this.rejectAuth = this.authResolver.isAuthorized('vo-rejectApplication_int_String_policy', [
        this.application.vo,
      ]);
      this.deleteAuth = this.authResolver.isAuthorized('vo-deleteApplication_Application_policy', [
        this.application.vo,
      ]);
      this.resendAuth = this.authResolver.isAuthorized(
        'vo-sendMessage_Application_MailType_String_policy',
        [this.application.vo],
      );
    }
  }

  resendNotification(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      applicationId: this.application.id,
      theme: this.dialogTheme,
      appType: this.application.type,
      voId: this.application.vo.id,
      groupId: this.application.group?.id,
    };

    this.dialog.open(ApplicationReSendNotificationDialogComponent, config);
  }

  deleteApplication(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      items: [this.application.id],
      title: 'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.DELETE_APPLICATION_TITLE',
      description: 'VO_DETAIL.APPLICATION.APPLICATION_DETAIL.DELETE_APPLICATION_DESCRIPTION',
      theme: 'vo-theme',
      type: 'remove',
      showAsk: true,
    };

    const dialogRef = this.dialog.open(UniversalConfirmationItemsDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.registrarManager.deleteApplication(this.application.id).subscribe(() => {
          this.translate
            .get('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.DELETE_MESSAGE')
            .subscribe((successMessage: string) => {
              this.notificator.showSuccess(successMessage);
              void this.router.navigateByUrl(
                this.router.url.substring(0, this.router.url.lastIndexOf('/')),
              );
            });
        });
      }
    });
  }

  rejectApplication(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = { applicationId: this.application.id, theme: this.dialogTheme };

    const dialogRef = this.dialog.open(ApplicationRejectDialogComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      this.loading = true;
      this.registrarManager.getApplicationById(this.application.id).subscribe(
        (reloaded) => {
          this.application = reloaded;
          this.loading = false;
        },
        () => (this.loading = false),
      );
    });
  }

  approveApplication(): void {
    this.loading = true;
    this.registrarManager.approveApplication(this.application.id).subscribe(
      () => {
        this.translate
          .get('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.APPROVE_MESSAGE')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
          });
        this.registrarManager.getApplicationById(this.application.id).subscribe(
          (reloaded) => {
            this.application = reloaded;
            this.loading = false;
          },
          () => (this.loading = false),
        );
      },
      () => (this.loading = false),
    );
  }

  verifyApplication(): void {
    this.registrarManager.verifyApplication(this.application.id).subscribe(() => {
      this.translate
        .get('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.VERIFY_MESSAGE')
        .subscribe((successMessage: string) => {
          this.notificator.showSuccess(successMessage);
        });
      this.loading = true;
      this.registrarManager.getApplicationById(this.application.id).subscribe({
        next: (reloaded) => {
          this.application = reloaded;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    });
  }

  editApplicationData(data: ApplicationFormItemData): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      theme: this.dialogTheme,
      applicationId: this.application.id,
      formItemData: data,
    };

    this.dialog.open(EditApplicationFormItemDataDialogComponent, config);
  }
}
