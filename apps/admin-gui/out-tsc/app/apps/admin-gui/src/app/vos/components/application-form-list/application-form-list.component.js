import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DeleteApplicationFormItemDialogComponent } from '../../../shared/components/dialogs/delete-application-form-item-dialog/delete-application-form-item-dialog.component';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { EditApplicationFormItemDialogComponent } from '../../../shared/components/dialogs/edit-application-form-item-dialog/edit-application-form-item-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let ApplicationFormListComponent = class ApplicationFormListComponent {
    constructor(dialog, notificator, translate) {
        this.dialog = dialog;
        this.notificator = notificator;
        this.translate = translate;
        this.applicationFormItems = [];
        this.applicationFormItemsChange = new EventEmitter();
        this.itemsChanged = [];
        this.dataSource = this.applicationFormItems;
        this.displayedColumns = ['drag', 'shortname', 'type', 'preview', 'edit', 'delete'];
        this.mapForCombobox = new Map();
        this.dragDisabled = true;
    }
    ngOnChanges(changes) {
        this.dataSource = this.applicationFormItems;
    }
    edit(applicationFormItem) {
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.height = '600px';
        config.data = { voId: this.applicationForm.vo.id,
            group: this.applicationForm.group,
            applicationFormItem: applicationFormItem };
        const editDialog = this.dialog.open(EditApplicationFormItemDialogComponent, config);
        editDialog.afterClosed().subscribe((success) => {
            if (success) {
                this.itemsChanged.push(applicationFormItem.id);
                this.applicationFormItemsChange.emit();
            }
        });
    }
    delete(applicationFormItem) {
        const config = getDefaultDialogConfig();
        config.width = '500px';
        const dialog = this.dialog.open(DeleteApplicationFormItemDialogComponent, config);
        dialog.afterClosed().subscribe(deleteItem => {
            if (deleteItem) {
                applicationFormItem.forDelete = true;
                if (applicationFormItem.id === 0) {
                    this.applicationFormItems.splice(this.applicationFormItems.indexOf(applicationFormItem), 1);
                    this.table.renderRows();
                }
                this.applicationFormItemsChange.emit();
            }
        });
    }
    drop(event) {
        this.dragDisabled = true;
        const prevIndex = this.applicationFormItems.indexOf(event.item.data);
        moveItemInArray(this.applicationFormItems, prevIndex, event.currentIndex);
        this.itemsChanged.push(this.applicationFormItems[event.currentIndex].id);
        this.applicationFormItemsChange.emit();
        this.table.renderRows();
    }
    getLocalizedOptions(applicationFormItem) {
        if (applicationFormItem.i18n[this.translate.getDefaultLang()]) {
            const options = applicationFormItem.i18n[this.translate.getDefaultLang()].options;
            if (options !== null && options !== '') {
                const labels = [];
                for (const item of options.split('|')) {
                    labels.push(item.split('#')[1]);
                }
                return labels;
            }
        }
        return [];
    }
    getLocalizedLabel(applicationFormItem) {
        if (applicationFormItem.i18n[this.translate.getDefaultLang()]) {
            return applicationFormItem.i18n[this.translate.getDefaultLang()].label;
        }
        return applicationFormItem.shortname;
    }
    restore(applicationFormItem) {
        applicationFormItem.forDelete = false;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ApplicationFormListComponent.prototype, "loading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ApplicationFormListComponent.prototype, "applicationForm", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ApplicationFormListComponent.prototype, "applicationFormItems", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], ApplicationFormListComponent.prototype, "applicationFormItemsChange", void 0);
__decorate([
    ViewChild('table'),
    __metadata("design:type", MatTable)
], ApplicationFormListComponent.prototype, "table", void 0);
ApplicationFormListComponent = __decorate([
    Component({
        selector: 'app-application-form-list',
        templateUrl: './application-form-list.component.html',
        styleUrls: ['./application-form-list.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        NotificatorService,
        TranslateService])
], ApplicationFormListComponent);
export { ApplicationFormListComponent };
//# sourceMappingURL=application-form-list.component.js.map