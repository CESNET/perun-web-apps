import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {NotificatorService} from '@perun-web-apps/perun/services';
import {SelectionModel} from '@angular/cdk/collections';
import {
  AddEditNotificationDialogComponent
} from '../../../../../shared/components/dialogs/add-edit-notification-dialog/add-edit-notification-dialog.component';
import {
  DeleteNotificationDialogComponent
} from '../../../../../shared/components/dialogs/delete-notification-dialog/delete-notification-dialog.component';
import {
  NotificationsCopyMailsDialogComponent
} from '../../../../../shared/components/dialogs/notifications-copy-mails-dialog/notifications-copy-mails-dialog.component';
import {
  EditEmailFooterDialogComponent
} from '../../../../../shared/components/dialogs/edit-email-footer-dialog/edit-email-footer-dialog.component';
import { ApplicationForm, ApplicationMail, RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { ApiRequestConfigurationService } from '@perun-web-apps/perun/services';
import { createNewApplicationMail, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { PageEvent } from '@angular/material/paginator';
import {
  TABLE_GROUP_SETTINGS_NOTIFICATIONS,
  TableConfigService
} from '@perun-web-apps/config/table-config';

@Component({
  selector: 'app-group-settings-notifications',
  templateUrl: './group-settings-notifications.component.html',
  styleUrls: ['./group-settings-notifications.component.scss']
})
export class GroupSettingsNotificationsComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private route: ActivatedRoute,
    private registrarService: RegistrarManagerService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private apiRequest: ApiRequestConfigurationService,
    private tableConfigService: TableConfigService,
    private notificator: NotificatorService) {
  }

  loading = false;
  voId: number;
  groupId: number;
  applicationForm: ApplicationForm;
  applicationMails: ApplicationMail[] = [];
  selection = new SelectionModel<ApplicationMail>(true, []);
  noApplicationForm = false;
  pageSize: number;

  private tableId = TABLE_GROUP_SETTINGS_NOTIFICATIONS;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);

    this.loading = true;
    this.route.parent.parent.params.subscribe(params => {
      this.voId = params['voId'];
      this.groupId = params['groupId'];

      // FIXME this might not work in case of some race condition (other request finishes sooner)
      this.apiRequest.dontHandleErrorForNext();
      this.registrarService.getGroupApplicationForm(this.groupId).subscribe( form => {
        this.applicationForm = form;
        this.registrarService.getApplicationMailsForGroup(this.groupId).subscribe( mails => {
          this.applicationMails = mails;
          this.loading = false;
        });
      }, error => {
        if (error.name === 'FormNotExistsException') {
          this.noApplicationForm = true;
          this.loading = false;
        } else {
          this.notificator.showRPCError(error);
        }
      });
    });
  }

  add() {
    const applicationMail: ApplicationMail = createNewApplicationMail();
    applicationMail.formId = this.applicationForm.id;

    const config = getDefaultDialogConfig();
    config.width = '1400px';
    config.height = '700px';
    config.data = {voId: this.voId,
      groupId: this.groupId,
      createMailNotification: true,
      applicationMail: applicationMail,
      applicationMails: this.applicationMails};

    const dialog = this.dialog.open(AddEditNotificationDialogComponent, config);
    dialog.afterClosed().subscribe( success => {
      if (success) {
        this.translate.get('GROUP_DETAIL.SETTINGS.NOTIFICATIONS.ADD_SUCCESS').subscribe( text => {
          this.notificator.showSuccess(text);
        });
        this.selection.clear();
        this.updateTable();
      }
    });
  }

  remove() {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {voId: this.voId, groupId: this.groupId, mails: this.selection.selected};

    const dialog = this.dialog.open(DeleteNotificationDialogComponent, config);
    dialog.afterClosed().subscribe( success => {
      if (success) {
        this.translate.get('GROUP_DETAIL.SETTINGS.NOTIFICATIONS.DELETE_SUCCESS').subscribe( text => {
          this.notificator.showSuccess(text);
        });
        this.selection.clear();
        this.updateTable();
      }
    });
  }

  copy() {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {voId: this.voId, groupId: this.groupId};

    const dialog = this.dialog.open(NotificationsCopyMailsDialogComponent, config);
    dialog.afterClosed().subscribe( copyFrom => {
      if (copyFrom) {
        this.selection.clear();
        this.updateTable();
      }
    });
  }

  updateTable() {
    this.loading = true;
    this.registrarService.getApplicationMailsForGroup(this.groupId).subscribe( mails => {
      this.applicationMails = mails;
      this.loading = false;
    });
  }

  changeEmailFooter() {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {voId: this.voId, groupId: this.groupId};

    this.dialog.open(EditEmailFooterDialogComponent, config);
  }

  changeSelection(selection: SelectionModel<ApplicationMail>) {
    this.selection = selection;
  }

  createEmptyApplicationForm() {
    this.registrarService.createApplicationFormInGroup(this.groupId).subscribe( () => {
      this.noApplicationForm = false;
      this.ngOnInit();
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
