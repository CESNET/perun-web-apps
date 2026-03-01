import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GuiAuthResolver, NotificatorService } from '@perun-web-apps/perun/services';
import {
  Group,
  GroupsManagerService,
  InvitationWithSender,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { UniversalConfirmationItemsDialogComponent } from '@perun-web-apps/perun/dialogs';
import { ModifiedNamePipe } from '@perun-web-apps/perun/pipes';
import { ApplicationStatePipe } from '@perun-web-apps/perun/pipes';
import {
  ApplicationDetailDTO,
  ApplicationDTO,
  DecisionDTO,
  EnrichedFormItemDataDTO,
  SubmissionDTO,
  SubmissionsService,
} from '@perun-web-apps/perun/registrar-openapi';
import { ApplicationRejectNewRegDialogComponent } from '../../../shared/components/dialogs/application-reject-new-reg-dialog/application-reject-new-reg-dialog.component';
import { GetLabelNewRegPipe } from '@perun-web-apps/perun/pipes';
import { ApplicationReSendNotificationNewRegDialogComponent } from '../../../shared/components/dialogs/application-re-send-notification-new-reg-dialog/application-re-send-notification-new-reg-dialog.component';
@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MiddleClickRouterLinkDirective,
    RouterModule,
    MatDivider,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip,
    ModifiedNamePipe,
    ApplicationStatePipe,
    GetLabelNewRegPipe,
  ],
  standalone: true,
  selector: 'app-application-detail-new-reg',
  templateUrl: './application-detail-new-reg.component.html',
  styleUrls: ['./application-detail-new-reg.component.scss'],
})
export class ApplicationDetailNewRegComponent implements OnInit {
  // used for router animation
  @HostBinding('class.router-component') true;
  application: ApplicationDTO;
  latestDecision: DecisionDTO;
  submission: SubmissionDTO;
  userData: EnrichedFormItemDataDTO[] = [];
  userMail: string;
  displayedColumns: string[] = ['label', 'value'];
  dataSource: MatTableDataSource<EnrichedFormItemDataDTO>;
  loading = true;
  dialogTheme: string;
  verifyAuth: boolean;
  approveAuth: boolean;
  rejectAuth: boolean;
  deleteAuth: boolean;
  resendAuth: boolean;
  invitation: InvitationWithSender = null;
  vo: Vo;
  group: Group;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private notificator: NotificatorService,
    private router: Router,
    private authResolver: GuiAuthResolver,
    private submissionsService: SubmissionsService,
    private vosService: VosManagerService,
    private groupsService: GroupsManagerService,
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
        const applicationId = String(params['applicationId']);
        this.submissionsService.getApplication(applicationId).subscribe((application) => {
          this.application = application.application;
          this.userData = application.formItemData;
          this.latestDecision = application.decisions[0];
          this.submission = application.submission;
          this.dataSource = new MatTableDataSource<EnrichedFormItemDataDTO>(this.userData);
          if (application.formSpecification.idmObject.idmObjectType === 'VO') {
            this.vosService
              .getVoById(Number(application.formSpecification.idmObject.objectId))
              .subscribe((vo) => {
                this.vo = vo;
                this.setAuthRights();
                this.loading = false;
              });
          } else {
            this.groupsService
              .getGroupById(Number(application.formSpecification.idmObject.objectId))
              .subscribe((group) => {
                this.group = group;
                this.vosService.getVoById(group.voId).subscribe((vo) => {
                  this.vo = vo;
                  this.setAuthRights();
                  this.loading = false;
                });
              });
          }
        });
      });
    });
  }

  setAuthRights(): void {
    if (this.dialogTheme === 'group-theme') {
      this.verifyAuth = this.authResolver.isAuthorized('group-verifyApplication_int_policy', [
        this.group,
      ]);
      this.approveAuth = this.authResolver.isAuthorized(
        'group-approveApplicationInternal_int_policy',
        [this.group],
      );
      this.rejectAuth = this.authResolver.isAuthorized(
        'group-rejectApplication_int_String_policy',
        [this.group],
      );
      this.deleteAuth = this.authResolver.isAuthorized(
        'group-deleteApplication_Application_policy',
        [this.group],
      );
      this.resendAuth = this.authResolver.isAuthorized(
        'group-sendMessage_Application_MailType_String_policy',
        [this.group],
      );
    } else {
      this.verifyAuth = this.authResolver.isAuthorized('vo-verifyApplication_int_policy', [
        this.vo,
      ]);
      this.approveAuth = this.authResolver.isAuthorized(
        'vo-approveApplicationInternal_int_policy',
        [this.vo],
      );
      this.rejectAuth = this.authResolver.isAuthorized('vo-rejectApplication_int_String_policy', [
        this.vo,
      ]);
      this.deleteAuth = this.authResolver.isAuthorized('vo-deleteApplication_Application_policy', [
        this.vo,
      ]);
      this.resendAuth = this.authResolver.isAuthorized(
        'vo-sendMessage_Application_MailType_String_policy',
        [this.vo],
      );
    }
  }

  resendNotification(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      applicationId: this.application.id,
      theme: this.dialogTheme,
      appType: this.application.type.formType,
      voId: this.vo.id,
      groupId: this.group?.id,
      userId: Number(this.application.idmUserId),
    };

    this.dialog.open(ApplicationReSendNotificationNewRegDialogComponent, config);
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
        this.submissionsService.deleteApplication(this.application.id).subscribe(() => {
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

    const dialogRef = this.dialog.open(ApplicationRejectNewRegDialogComponent, config);

    dialogRef.afterClosed().subscribe((application: ApplicationDetailDTO) => {
      this.application = application.application;
      this.latestDecision = application.decisions[0];
    });
  }

  approveApplication(): void {
    this.loading = true;
    this.submissionsService.approveApplication(this.application.id).subscribe({
      next: (application) => {
        this.translate
          .get('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.APPROVE_MESSAGE')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
          });
        this.application = application.application;
        this.latestDecision = application.decisions[0];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  verifyApplication(): void {
    this.loading = true;
    this.submissionsService.forceVerifyApplication(this.application.id).subscribe((application) => {
      this.translate
        .get('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.VERIFY_MESSAGE')
        .subscribe((successMessage: string) => {
          this.notificator.showSuccess(successMessage);
        });
      this.application = application.application;
      this.latestDecision = application.decisions[0];
      this.loading = false;
    });
  }
  //
  // editApplicationData(data: ApplicationFormItemData): void {
  //   const config = getDefaultDialogConfig();
  //   config.width = '600px';
  //   config.data = {
  //     theme: this.dialogTheme,
  //     applicationId: this.application.id,
  //     formItemData: data,
  //   };
  //
  //   this.dialog.open(EditApplicationFormItemDataDialogComponent, config);
  // }
}
