import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateApplicationFormDialogComponent } from '../../../../../shared/components/dialogs/update-application-form-dialog/update-application-form-dialog.component';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationFormCopyItemsDialogComponent } from '../../../../../shared/components/dialogs/application-form-copy-items-dialog/application-form-copy-items-dialog.component';
import { AddApplicationFormItemDialogComponent } from '../../../../../shared/components/dialogs/add-application-form-item-dialog/add-application-form-item-dialog.component';
import { EditApplicationFormItemDialogComponent } from '../../../../../shared/components/dialogs/edit-application-form-item-dialog/edit-application-form-item-dialog.component';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let VoSettingsApplicationFormComponent = class VoSettingsApplicationFormComponent {
    constructor(registrarManager, route, dialog, notificator, translate, router) {
        this.registrarManager = registrarManager;
        this.route = route;
        this.dialog = dialog;
        this.notificator = notificator;
        this.translate = translate;
        this.router = router;
        this.loading = false;
        this.applicationFormItems = [];
        this.itemsChanged = false;
    }
    ngOnInit() {
        this.loading = true;
        this.route.parent.parent.params.subscribe(params => {
            const voId = params['voId'];
            this.voId = voId;
            this.registrarManager.getVoApplicationForm(voId).subscribe(form => {
                this.applicationForm = form;
                this.registrarManager.getFormItemsForVo(voId).subscribe(formItems => {
                    this.applicationFormItems = formItems;
                    this.loading = false;
                });
            });
        });
    }
    add() {
        let config = getDefaultDialogConfig();
        config.width = '500px';
        config.data = { applicationFormItems: this.applicationFormItems };
        const dialog = this.dialog.open(AddApplicationFormItemDialogComponent, config);
        dialog.afterClosed().subscribe(success => {
            // success is field contains of two items: first is applicationFormItems with new item in it,
            // second item is new Application Form Item
            if (success) {
                this.applicationFormItems = Object.assign([], success[0]);
                config = getDefaultDialogConfig();
                config.width = '600px';
                config.height = '600px';
                config.data = { voId: this.voId, applicationFormItem: success[1] };
                this.dialog.open(EditApplicationFormItemDialogComponent, config);
                this.itemsChanged = true;
            }
        });
    }
    copy() {
        const config = getDefaultDialogConfig();
        config.width = '500px';
        config.data = { voId: this.voId };
        const dialog = this.dialog.open(ApplicationFormCopyItemsDialogComponent, config);
        dialog.afterClosed().subscribe(copyFrom => {
            if (copyFrom) {
                this.updateFormItems();
            }
        });
    }
    settings() {
        const config = getDefaultDialogConfig();
        config.width = '400px';
        config.data = { applicationForm: this.applicationForm };
        const dialog = this.dialog.open(UpdateApplicationFormDialogComponent, config);
        dialog.afterClosed().subscribe(newForm => {
            if (newForm) {
                this.translate.get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_SETTINGS_SUCCESS').subscribe(successMessage => {
                    this.notificator.showSuccess(successMessage);
                });
                this.applicationForm = newForm;
            }
        });
    }
    preview() {
        this.router.navigate(['/organizations', this.voId, 'settings', 'applicationForm', 'preview'], { queryParams: { applicationFormItems: JSON.stringify(this.applicationFormItems) } });
    }
    updateFormItems() {
        this.loading = true;
        this.registrarManager.getFormItemsForVo(this.voId).subscribe(formItems => {
            this.applicationFormItems = formItems;
            this.itemsChanged = false;
            this.loading = false;
        });
    }
    changeItems() {
        this.itemsChanged = true;
    }
    save() {
        let i = 0;
        for (const item of this.applicationFormItems) {
            item.ordnum = i;
            if (!item.forDelete) {
                i++;
            }
        }
        console.log(this.applicationFormItems);
        // @ts-ignore
        this.registrarManager.updateFormItemsForVo({ vo: this.voId, items: this.applicationFormItems }).subscribe(() => {
            this.translate.get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_APPLICATION_FORM_ITEMS_SUCCESS')
                .subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
            });
            this.updateFormItems();
        });
    }
};
VoSettingsApplicationFormComponent.id = 'VoSettingsApplicationFormComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoSettingsApplicationFormComponent.prototype, "true", void 0);
VoSettingsApplicationFormComponent = __decorate([
    Component({
        selector: 'app-vo-settings-application-form',
        templateUrl: './vo-settings-application-form.component.html',
        styleUrls: ['./vo-settings-application-form.component.scss']
    }),
    __metadata("design:paramtypes", [RegistrarManagerService,
        ActivatedRoute,
        MatDialog,
        NotificatorService,
        TranslateService,
        Router])
], VoSettingsApplicationFormComponent);
export { VoSettingsApplicationFormComponent };
//# sourceMappingURL=vo-settings-application-form.component.js.map