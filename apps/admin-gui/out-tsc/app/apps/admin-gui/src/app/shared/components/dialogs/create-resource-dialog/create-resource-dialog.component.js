import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResourcesManagerService, VosManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
let CreateResourceDialogComponent = class CreateResourceDialogComponent {
    constructor(dialogRef, data, notificator, voService, translate, resourcesManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.voService = voService;
        this.translate = translate;
        this.resourcesManager = resourcesManager;
        this.organizationCtrl = new FormControl();
        this.vos = [];
        this.selectedVo = null;
        translate.get('DIALOGS.CREATE_RESOURCE.SUCCESS').subscribe(value => this.successMessage = value);
    }
    ngOnInit() {
        this.theme = this.data.theme;
        this.voService.getAllVos().subscribe(vos => {
            this.vos = vos;
            this.filteredVos = this.organizationCtrl.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
        });
        this.nameCtrl = new FormControl(null, [Validators.required, Validators.pattern('.*[\\S]+.*')]);
        this.descriptionCtrl = new FormControl(null, [Validators.required, Validators.pattern('.*[\\S]+.*')]);
    }
    _filter(value) {
        const filterValue = value.toLowerCase();
        return this.vos.filter(option => option.name.toLowerCase().indexOf(filterValue) >= 0
            || option.shortName.toLowerCase().indexOf(filterValue) >= 0);
    }
    onSubmit() {
        this.loading = true;
        this.resourcesManager.createResource(this.selectedVo.id, this.data.facilityId, this.nameCtrl.value, this.descriptionCtrl.value).subscribe(() => {
            this.notificator.showSuccess(this.successMessage);
            this.loading = false;
            this.dialogRef.close(true);
        }, () => this.loading = false);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
};
CreateResourceDialogComponent = __decorate([
    Component({
        selector: 'app-create-resource-dialog',
        templateUrl: './create-resource-dialog.component.html',
        styleUrls: ['./create-resource-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        VosManagerService,
        TranslateService,
        ResourcesManagerService])
], CreateResourceDialogComponent);
export { CreateResourceDialogComponent };
//# sourceMappingURL=create-resource-dialog.component.js.map