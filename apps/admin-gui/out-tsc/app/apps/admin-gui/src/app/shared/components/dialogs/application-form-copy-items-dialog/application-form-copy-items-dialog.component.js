import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { GroupsManagerService, RegistrarManagerService, VosManagerService } from '@perun-web-apps/perun/openapi';
let ApplicationFormCopyItemsDialogComponent = class ApplicationFormCopyItemsDialogComponent {
    constructor(dialogRef, voService, groupService, translateService, registrarManager, data) {
        this.dialogRef = dialogRef;
        this.voService = voService;
        this.groupService = groupService;
        this.translateService = translateService;
        this.registrarManager = registrarManager;
        this.data = data;
        this.vos = [];
        this.groups = [];
        this.voControl = new FormControl();
        this.groupControl = new FormControl();
    }
    ngOnInit() {
        this.translateService.get('DIALOGS.APPLICATION_FORM_COPY_ITEMS.NO_GROUP_SELECTED').subscribe(text => {
            this.fakeGroup = {
                id: -1,
                name: text,
                voId: 0,
                parentGroupId: 0,
                shortName: '',
                description: '',
                beanName: 'group'
            };
            this.groupControl.setValue(this.fakeGroup);
            this.voService.getAllVos().subscribe(vos => {
                this.vos = vos;
                this.voControl = new FormControl('', [this.invalidVo(this.vos), Validators.required]);
                this.filteredVos = this.voControl.valueChanges
                    .pipe(startWith(''), map(value => typeof value === 'string' ? value : value.name), map(name => name ? this._filterVo(name) : this.vos.slice()));
                this.vos = vos.sort(((vo1, vo2) => {
                    if (vo1.name > vo2.name) {
                        return 1;
                    }
                    if (vo1.name < vo2.name) {
                        return -1;
                    }
                    return 0;
                }));
            });
        });
    }
    cancel() {
        this.dialogRef.close(false);
    }
    _filterVo(value) {
        const filterValue = value.toLowerCase();
        return this.vos.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    _filterGroup(value) {
        const filterValue = value.toLowerCase();
        return this.groups.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    displayFn(entity) {
        return entity ? entity.name : undefined;
    }
    submit() {
        if (this.data.groupId) { // checking if the dialog is for group or Vo
            if (this.groupControl.value === this.fakeGroup) { // no group selected
                this.registrarManager.copyFormFromVoToGroup(this.voControl.value.id, this.data.groupId).subscribe(() => {
                    this.dialogRef.close(true);
                });
            }
            else {
                this.registrarManager.copyFormFromGroupToGroup(this.groupControl.value.id, this.data.groupId).subscribe(() => {
                    this.dialogRef.close(true);
                });
            }
        }
        else {
            if (this.groupControl.value === this.fakeGroup) { // no group selected
                this.registrarManager.copyFormFromVoToVo(this.voControl.value.id, this.data.voId).subscribe(() => {
                    this.dialogRef.close(true);
                });
            }
            else {
                this.registrarManager.copyFormFromGroupToVo(this.groupControl.value.id, this.data.voId).subscribe(() => {
                    this.dialogRef.close(true);
                });
            }
        }
    }
    getGroups() {
        if (!this.voControl.invalid) {
            this.groupService.getAllGroups(this.voControl.value.id).subscribe(groups => {
                this.groups = [this.fakeGroup].concat(groups);
                this.groupControl.setValidators([this.invalidGroup(this.groups), Validators.required]);
                this.filteredGroups = this.groupControl.valueChanges
                    .pipe(startWith(''), map(value => typeof value === 'string' ? value : value.name), map(name => name ? this._filterGroup(name) : this.groups.slice()));
            });
        }
        else {
            this.groups = [this.fakeGroup];
        }
    }
    invalidVo(vos) {
        return (control) => {
            let invalid = false;
            if (control.value) {
                if (control.value.beanName) {
                    if (control.value.beanName !== 'Vo') {
                        invalid = true;
                    }
                }
                else {
                    const vo = vos.find(x => x.name.toLowerCase() === control.value.toLowerCase());
                    if (!vo) {
                        invalid = true;
                    }
                    else {
                        control.setValue(vo);
                    }
                }
            }
            return invalid ? { 'invalidVo': true } : null;
        };
    }
    invalidGroup(groups) {
        return (control) => {
            let invalid = false;
            if (control.value) {
                if (control.value.beanName) {
                    if (control.value.beanName !== 'Group') {
                        invalid = true;
                    }
                }
                else if (control.value === this.fakeGroup) {
                    invalid = false;
                }
                else {
                    const group = groups.find(x => x.name.toLowerCase() === control.value.toLowerCase());
                    if (!group) {
                        invalid = true;
                    }
                    else {
                        control.setValue(group);
                    }
                }
            }
            return invalid ? { 'invalidGroup': true } : null;
        };
    }
};
ApplicationFormCopyItemsDialogComponent = __decorate([
    Component({
        selector: 'app-application-form-copy-items-dialog',
        templateUrl: './application-form-copy-items-dialog.component.html',
        styleUrls: ['./application-form-copy-items-dialog.component.scss']
    }),
    __param(5, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef,
        VosManagerService,
        GroupsManagerService,
        TranslateService,
        RegistrarManagerService, Object])
], ApplicationFormCopyItemsDialogComponent);
export { ApplicationFormCopyItemsDialogComponent };
//# sourceMappingURL=application-form-copy-items-dialog.component.js.map