import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { ExtSourcesManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { map, startWith } from 'rxjs/operators';
let AddUserExtSourceDialogComponent = class AddUserExtSourceDialogComponent {
    constructor(dialogRef, data, extSourcesManagerService, usersManagerService, translate, notificator) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.extSourcesManagerService = extSourcesManagerService;
        this.usersManagerService = usersManagerService;
        this.translate = translate;
        this.notificator = notificator;
        this.extSources = [];
        this.loas = [0, 1, 2, 3];
        this.loa = 0;
        translate.get('DIALOGS.ADD_USER_EXT_SOURCE.SUCCESS').subscribe(res => this.successMessage = res);
    }
    ngOnInit() {
        this.loginControl = new FormControl(null, [Validators.required]);
        this.extSourcesControl = new FormControl('', [Validators.required]);
        this.filteredExtSources = this.extSourcesControl.valueChanges
            .pipe(startWith(''), map(value => this._filter(value)));
        this.extSourcesManagerService.getExtSources().subscribe(extSources => {
            this.extSources = extSources;
            this.filteredExtSources = this.extSourcesControl.valueChanges
                .pipe(startWith(''), map(value => this._filter(value)));
        });
    }
    displayFn(extSource) {
        return extSource ? extSource.name : null;
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onAdd() {
        this.loading = true;
        const ues = {
            beanName: '',
            extSource: this.extSourcesControl.value,
            id: 0,
            login: this.loginControl.value,
            loa: this.loa,
            userId: this.data.userId
        };
        this.usersManagerService.addUserExtSource({ user: this.data.userId, userExtSource: ues }).subscribe(() => {
            this.loading = false;
            this.notificator.showSuccess(this.successMessage);
            this.dialogRef.close(true);
        }, () => this.loading = false);
    }
    _filter(value) {
        const filterValue = typeof (value) === 'string' ? value.toLowerCase() : value.name.toLowerCase;
        return this.extSources.filter(option => option.name.toLowerCase().includes(filterValue));
    }
};
AddUserExtSourceDialogComponent = __decorate([
    Component({
        selector: 'app-add-user-ext-source-dialog',
        templateUrl: './add-user-ext-source-dialog.component.html',
        styleUrls: ['./add-user-ext-source-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, ExtSourcesManagerService,
        UsersManagerService,
        TranslateService,
        NotificatorService])
], AddUserExtSourceDialogComponent);
export { AddUserExtSourceDialogComponent };
//# sourceMappingURL=add-user-ext-source-dialog.component.js.map