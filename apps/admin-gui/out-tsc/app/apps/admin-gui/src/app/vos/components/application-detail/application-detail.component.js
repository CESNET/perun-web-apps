import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationReSendNotificationDialogComponent } from '../../../shared/components/dialogs/application-re-send-notification-dialog/application-re-send-notification-dialog.component';
import { ApplicationRejectDialogComponent } from '../../../shared/components/dialogs/application-reject-dialog/application-reject-dialog.component';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let ApplicationDetailComponent = class ApplicationDetailComponent {
    constructor(registrarManager, dialog, translate, route, notificator, router) {
        this.registrarManager = registrarManager;
        this.dialog = dialog;
        this.translate = translate;
        this.route = route;
        this.notificator = notificator;
        this.router = router;
        this.userData = [];
        this.displayedColumns = ['label', 'value'];
        this.loading = true;
    }
    ngOnInit() {
        this.loading = true;
        this.route.params.subscribe(parentParams => {
            const applicationId = parentParams['applicationId'];
            this.registrarManager.getApplicationById(applicationId).subscribe(application => {
                this.application = application;
                this.registrarManager.getApplicationDataById(this.application.id).subscribe(value => {
                    this.userData = value;
                    this.dataSource = new MatTableDataSource(this.userData);
                    this.loading = false;
                });
            });
        });
    }
    getLabel(formItem) {
        if (formItem.i18n['en'].label !== null) {
            if (formItem.i18n['en'].label.length !== 0) {
                return formItem.i18n['en'].label; // prerobit na ne en
            }
        }
        return formItem.shortname;
    }
    submittedBy() {
        return this.application.createdBy.slice(this.application.createdBy.lastIndexOf('=') + 1, this.application.createdBy.length);
    }
    getModifiedAtName(modifiedBy) {
        const index = modifiedBy.lastIndexOf('/CN=');
        if (index !== -1) {
            const string = modifiedBy.slice(index + 4, modifiedBy.length).replace('/unstructuredName=', ' ');
            if (string.lastIndexOf('\\') !== -1) {
                return modifiedBy.slice(modifiedBy.lastIndexOf('=') + 1, modifiedBy.length);
            }
            return string;
        }
        return modifiedBy;
    }
    resendNotification() {
        const config = getDefaultDialogConfig();
        config.width = '500px';
        config.data = { applicationId: this.application.id };
        this.dialog.open(ApplicationReSendNotificationDialogComponent, config);
    }
    deleteApplication() {
        this.registrarManager.deleteApplication(this.application.id).subscribe(() => {
            this.translate.get('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.DELETE_MESSAGE').subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
                this.router.navigateByUrl(this.router.url.substring(0, this.router.url.lastIndexOf('/')));
            });
        });
    }
    rejectApplication() {
        const config = getDefaultDialogConfig();
        config.width = '500px';
        config.data = { applicationId: this.application.id };
        const dialogRef = this.dialog.open(ApplicationRejectDialogComponent, config);
        dialogRef.afterClosed().subscribe(() => {
            this.loading = true;
            this.registrarManager.getApplicationById(this.application.id).subscribe(reloaded => {
                this.application = reloaded;
                this.loading = false;
            });
        });
    }
    approveApplication() {
        this.registrarManager.approveApplication(this.application.id).subscribe(() => {
            this.translate.get('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.APPROVE_MESSAGE').subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
            });
            this.loading = true;
            this.registrarManager.getApplicationById(this.application.id).subscribe(reloaded => {
                this.application = reloaded;
                this.loading = false;
            });
        });
    }
    verifyApplication() {
        this.registrarManager.verifyApplication(this.application.id).subscribe(() => {
            this.translate.get('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.VERIFY_MESSAGE').subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
            });
            this.loading = true;
            this.registrarManager.getApplicationById(this.application.id).subscribe(reloaded => {
                this.application = reloaded;
                this.loading = false;
            });
        });
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], ApplicationDetailComponent.prototype, "true", void 0);
ApplicationDetailComponent = __decorate([
    Component({
        selector: 'app-application-detail',
        templateUrl: './application-detail.component.html',
        styleUrls: ['./application-detail.component.scss']
    }),
    __metadata("design:paramtypes", [RegistrarManagerService,
        MatDialog,
        TranslateService,
        ActivatedRoute,
        NotificatorService,
        Router])
], ApplicationDetailComponent);
export { ApplicationDetailComponent };
//# sourceMappingURL=application-detail.component.js.map