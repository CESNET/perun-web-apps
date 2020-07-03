import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { DeleteNotificationDialogComponent } from '../../../../../shared/components/dialogs/delete-notification-dialog/delete-notification-dialog.component';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { EditEmailFooterDialogComponent } from '../../../../../shared/components/dialogs/edit-email-footer-dialog/edit-email-footer-dialog.component';
import { AddEditNotificationDialogComponent } from '../../../../../shared/components/dialogs/add-edit-notification-dialog/add-edit-notification-dialog.component';
import { NotificationsCopyMailsDialogComponent } from '../../../../../shared/components/dialogs/notifications-copy-mails-dialog/notifications-copy-mails-dialog.component';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { createNewApplicationMail, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { TABLE_VO_SETTINGS_NOTIFICATIONS, TableConfigService } from '@perun-web-apps/config/table-config';
let VoSettingsNotificationsComponent = class VoSettingsNotificationsComponent {
    constructor(route, registrarService, translate, dialog, tableConfigService, notificator) {
        this.route = route;
        this.registrarService = registrarService;
        this.translate = translate;
        this.dialog = dialog;
        this.tableConfigService = tableConfigService;
        this.notificator = notificator;
        this.loading = false;
        this.applicationMails = [];
        this.selection = new SelectionModel(true, []);
        this.tableId = TABLE_VO_SETTINGS_NOTIFICATIONS;
    }
    ngOnInit() {
        this.loading = true;
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.parent.params.subscribe(params => {
            this.voId = params['voId'];
            this.registrarService.getVoApplicationForm(this.voId).subscribe(form => {
                this.applicationForm = form;
                this.registrarService.getApplicationMailsForVo(this.voId).subscribe(mails => {
                    this.applicationMails = mails;
                    this.loading = false;
                });
            });
        });
    }
    add() {
        const applicationMail = createNewApplicationMail();
        applicationMail.formId = this.applicationForm.id;
        const config = getDefaultDialogConfig();
        config.width = '1400px';
        config.height = '700px';
        config.data = { voId: this.voId, createMailNotification: true, applicationMail: applicationMail, applicationMails: this.applicationMails };
        const dialog = this.dialog.open(AddEditNotificationDialogComponent, config);
        dialog.afterClosed().subscribe(success => {
            if (success) {
                this.translate.get('VO_DETAIL.SETTINGS.NOTIFICATIONS.ADD_SUCCESS').subscribe(text => {
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
        config.data = { voId: this.voId, mails: this.selection.selected };
        const dialog = this.dialog.open(DeleteNotificationDialogComponent, config);
        dialog.afterClosed().subscribe(success => {
            if (success) {
                this.translate.get('VO_DETAIL.SETTINGS.NOTIFICATIONS.DELETE_SUCCESS').subscribe(text => {
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
        config.data = { voId: this.voId };
        const dialog = this.dialog.open(NotificationsCopyMailsDialogComponent, config);
        dialog.afterClosed().subscribe(copyFrom => {
            if (copyFrom) {
                this.selection.clear();
                this.updateTable();
            }
        });
    }
    updateTable() {
        this.loading = true;
        this.registrarService.getApplicationMailsForVo(this.voId).subscribe(mails => {
            this.applicationMails = mails;
            this.loading = false;
        });
    }
    changeEmailFooter() {
        const config = getDefaultDialogConfig();
        config.width = '500px';
        config.data = { voId: this.voId };
        this.dialog.open(EditEmailFooterDialogComponent, config);
    }
    changeSelection(selection) {
        this.selection = selection;
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoSettingsNotificationsComponent.prototype, "true", void 0);
VoSettingsNotificationsComponent = __decorate([
    Component({
        selector: 'app-vo-settings-notifications',
        templateUrl: './vo-settings-notifications.component.html',
        styleUrls: ['./vo-settings-notifications.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        RegistrarManagerService,
        TranslateService,
        MatDialog,
        TableConfigService,
        NotificatorService])
], VoSettingsNotificationsComponent);
export { VoSettingsNotificationsComponent };
//# sourceMappingURL=vo-settings-notifications.component.js.map