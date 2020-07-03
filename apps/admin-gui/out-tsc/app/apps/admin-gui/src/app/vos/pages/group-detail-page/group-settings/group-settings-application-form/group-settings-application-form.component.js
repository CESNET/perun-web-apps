import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AddApplicationFormItemDialogComponent } from '../../../../../shared/components/dialogs/add-application-form-item-dialog/add-application-form-item-dialog.component';
import { EditApplicationFormItemDialogComponent } from '../../../../../shared/components/dialogs/edit-application-form-item-dialog/edit-application-form-item-dialog.component';
import { ApplicationFormCopyItemsDialogComponent } from '../../../../../shared/components/dialogs/application-form-copy-items-dialog/application-form-copy-items-dialog.component';
import { UpdateApplicationFormDialogComponent } from '../../../../../shared/components/dialogs/update-application-form-dialog/update-application-form-dialog.component';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { ApiRequestConfigurationService } from '@perun-web-apps/perun/services';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let GroupSettingsApplicationFormComponent = class GroupSettingsApplicationFormComponent {
    constructor(registrarManager, route, dialog, notificator, translate, apiRequest, router) {
        this.registrarManager = registrarManager;
        this.route = route;
        this.dialog = dialog;
        this.notificator = notificator;
        this.translate = translate;
        this.apiRequest = apiRequest;
        this.router = router;
        this.loading = false;
        this.applicationFormItems = [];
        this.noApplicationForm = false;
        this.itemsChanged = false;
    }
    ngOnInit() {
        this.loading = true;
        this.route.parent.parent.params.subscribe(params => {
            this.voId = params['voId'];
            this.groupId = params['groupId'];
            // FIXME this might not work in case of some race condition (other request finishes sooner)
            this.apiRequest.dontHandleErrorForNext();
            this.registrarManager.getGroupApplicationForm(this.groupId).subscribe(form => {
                this.applicationForm = form;
                this.registrarManager.getFormItemsForGroup(this.groupId).subscribe(formItems => {
                    this.applicationFormItems = formItems;
                    this.loading = false;
                });
            }, error => {
                if (error.error.name === 'FormNotExistsException') {
                    this.noApplicationForm = true;
                    this.loading = false;
                }
                else {
                    this.notificator.showRPCError(error.error);
                }
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
                config.data = { voId: this.voId,
                    groupId: this.groupId,
                    applicationFormItem: success[1] };
                this.dialog.open(EditApplicationFormItemDialogComponent, config);
                this.itemsChanged = true;
            }
        });
    }
    copy() {
        const config = getDefaultDialogConfig();
        config.width = '500px';
        config.data = { voId: this.voId, groupId: this.groupId };
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
                this.translate.get('GROUP_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_SETTINGS_SUCCESS').subscribe(successMessage => {
                    this.notificator.showSuccess(successMessage);
                });
                this.applicationForm = newForm;
            }
        });
    }
    preview() {
        this.router.navigate(['/organizations', this.voId, 'groups', this.groupId, 'settings', 'applicationForm', 'preview'], { queryParams: { applicationFormItems: JSON.stringify(this.applicationFormItems) } });
    }
    updateFormItems() {
        this.loading = true;
        this.registrarManager.getFormItemsForGroup(this.groupId).subscribe(formItems => {
            this.applicationFormItems = formItems;
            this.itemsChanged = false;
            this.loading = false;
        });
    }
    changeItems() {
        this.itemsChanged = true;
    }
    createEmptyApplicationForm() {
        this.registrarManager.createApplicationFormInGroup(this.groupId).subscribe(() => {
            this.noApplicationForm = false;
            this.ngOnInit();
        });
    }
    save() {
        let i = 0;
        for (const item of this.applicationFormItems) {
            item.ordnum = i;
            if (!item.forDelete) {
                i++;
            }
        }
        // @ts-ignore
        // TODO reimplement this
        this.registrarManager.updateFormItemsForGroup({ group: this.groupId, items: this.applicationFormItems }).subscribe(() => {
            this.translate.get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_APPLICATION_FORM_ITEMS_SUCCESS')
                .subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
            });
            this.updateFormItems();
        });
    }
};
GroupSettingsApplicationFormComponent.id = 'GroupSettingsApplicationFormComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupSettingsApplicationFormComponent.prototype, "true", void 0);
GroupSettingsApplicationFormComponent = __decorate([
    Component({
        selector: 'app-group-settings-application-form',
        templateUrl: './group-settings-application-form.component.html',
        styleUrls: ['./group-settings-application-form.component.scss']
    }),
    __metadata("design:paramtypes", [RegistrarManagerService,
        ActivatedRoute,
        MatDialog,
        NotificatorService,
        TranslateService,
        ApiRequestConfigurationService,
        Router])
], GroupSettingsApplicationFormComponent);
export { GroupSettingsApplicationFormComponent };
//# sourceMappingURL=group-settings-application-form.component.js.map