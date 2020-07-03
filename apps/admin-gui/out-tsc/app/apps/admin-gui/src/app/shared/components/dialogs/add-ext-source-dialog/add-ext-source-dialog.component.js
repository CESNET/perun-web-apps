import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExtSourcesManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { TABLE_ADD_EXTSOURCE_DIALOG, TableConfigService } from '@perun-web-apps/config/table-config';
let AddExtSourceDialogComponent = class AddExtSourceDialogComponent {
    constructor(dialogRef, data, extSourceService, notificator, tableConfigService, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.extSourceService = extSourceService;
        this.notificator = notificator;
        this.tableConfigService = tableConfigService;
        this.translate = translate;
        this.extSources = [];
        this.selection = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_ADD_EXTSOURCE_DIALOG;
        this.translate.get('DIALOGS.ADD_EXT_SOURCES.SUCCESS_ADDED').subscribe(result => this.successMessage = result);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.theme = this.data.theme;
        this.extSourceService.getExtSources().subscribe(sources => {
            this.extSources = sources.filter(source => !this.data.voExtSources.includes(source));
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    onAdd() {
        for (const source of this.selection.selected) {
            this.extSourceService.addExtSourceWithVoSource(this.data.voId, source.id).subscribe(_ => {
                this.notificator.showSuccess(this.successMessage + source.name);
                this.dialogRef.close(true);
            });
        }
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
AddExtSourceDialogComponent = __decorate([
    Component({
        selector: 'app-add-ext-source-dialog',
        templateUrl: './add-ext-source-dialog.component.html',
        styleUrls: ['./add-ext-source-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, ExtSourcesManagerService,
        NotificatorService,
        TableConfigService,
        TranslateService])
], AddExtSourceDialogComponent);
export { AddExtSourceDialogComponent };
//# sourceMappingURL=add-ext-source-dialog.component.js.map