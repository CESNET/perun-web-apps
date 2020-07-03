import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { AuthzResolverService, GroupsManagerService, VosManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_SELECT_GROUP_MANAGER_DIALOG, TableConfigService } from '@perun-web-apps/config/table-config';
let AddGroupManagerDialogComponent = class AddGroupManagerDialogComponent {
    constructor(dialogRef, data, authzService, voService, groupService, translate, notificator, route, tableConfigService, router) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.authzService = authzService;
        this.voService = voService;
        this.groupService = groupService;
        this.translate = translate;
        this.notificator = notificator;
        this.route = route;
        this.tableConfigService = tableConfigService;
        this.router = router;
        this.searchString = '';
        this.selection = new SelectionModel(true, []);
        this.groups = [];
        this.vos = [];
        this.myControl = new FormControl();
        this.firstSearchDone = false;
        this.tableId = TABLE_SELECT_GROUP_MANAGER_DIALOG;
        translate.get('DIALOGS.ADD_GROUPS.TITLE').subscribe(value => this.title = value);
        translate.get('DIALOGS.ADD_GROUPS.SUCCESS').subscribe(value => this.successMessage = value);
    }
    displayFn(vo) {
        return vo ? vo.name : null;
    }
    onCancel() {
        this.dialogRef.close();
    }
    onSubmit() {
        this.loading = true;
        this.authzService.setRoleWithGroupComplementaryObject({ role: this.selectedRole, authorizedGroups: this.selection.selected.map(group => group.id), complementaryObject: this.data.complementaryObject })
            .subscribe(() => {
            this.notificator.showSuccess(this.successMessage);
            this.loading = false;
            this.dialogRef.close();
        }, () => this.loading = false);
    }
    ngOnInit() {
        this.availableRoles = this.data.availableRoles;
        this.selectedRole = this.data.selectedRole;
        this.theme = this.data.theme;
        this.voService.getMyVos().subscribe(vos => {
            this.filteredOptions = this.myControl.valueChanges
                .pipe(startWith(''), map(value => this._filter(value)));
            this.vos = vos;
        });
    }
    _filter(value) {
        const filterValue = typeof (value) === 'string' ? value.toLowerCase() : value.name.toLowerCase;
        return this.vos.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    showVoGroups(event) {
        this.loading = true;
        this.groupService.getAllGroups(event.option.value.id).subscribe(groups => {
            this.groups = groups;
            this.loading = false;
            this.firstSearchDone = true;
        }, () => this.loading = false);
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
AddGroupManagerDialogComponent = __decorate([
    Component({
        selector: 'app-add-group-manager-dialog',
        templateUrl: './add-group-manager-dialog.component.html',
        styleUrls: ['./add-group-manager-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, AuthzResolverService,
        VosManagerService,
        GroupsManagerService,
        TranslateService,
        NotificatorService,
        ActivatedRoute,
        TableConfigService,
        Router])
], AddGroupManagerDialogComponent);
export { AddGroupManagerDialogComponent };
//# sourceMappingURL=add-group-manager-dialog.component.js.map