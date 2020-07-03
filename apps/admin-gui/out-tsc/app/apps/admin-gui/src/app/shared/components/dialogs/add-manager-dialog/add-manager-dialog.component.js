import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthzResolverService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ADD_MANAGER, TableConfigService } from '@perun-web-apps/config/table-config';
import { Urns } from '@perun-web-apps/perun/urns';
let AddManagerDialogComponent = class AddManagerDialogComponent {
    constructor(dialogRef, data, authzService, usersService, translate, notificator, storeService, route, router, tableConfigService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.authzService = authzService;
        this.usersService = usersService;
        this.translate = translate;
        this.notificator = notificator;
        this.storeService = storeService;
        this.route = route;
        this.router = router;
        this.tableConfigService = tableConfigService;
        this.searchString = '';
        this.selection = new SelectionModel(true, []);
        this.users = [];
        this.firstSearchDone = false;
        this.tableId = TABLE_ADD_MANAGER;
        translate.get('DIALOGS.ADD_MANAGERS.TITLE').subscribe(value => this.title = value);
        translate.get('DIALOGS.ADD_MANAGERS.SUCCESS').subscribe(value => this.successMessage = value);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.theme = this.data.theme;
        this.availableRoles = this.data.availableRoles;
        this.selectedRole = this.data.selectedRole;
    }
    onCancel() {
        this.dialogRef.close();
    }
    onSubmit() {
        this.loading = true;
        this.authzService.setRoleWithUserComplementaryObject({ role: this.selectedRole, users: this.selection.selected.map(u => u.id), complementaryObject: this.data.complementaryObject }).subscribe(() => {
            this.notificator.showSuccess(this.successMessage);
            this.loading = false;
            this.dialogRef.close();
        }, () => this.loading = false);
    }
    onSearchByString() {
        this.loading = true;
        this.selection.clear();
        let attributes = [
            Urns.USER_DEF_ORGANIZATION,
            Urns.USER_DEF_PREFERRED_MAIL
        ];
        attributes = attributes.concat(this.storeService.getLoginAttributeNames());
        this.usersService.findRichUsersWithAttributes(this.searchString, attributes).subscribe(users => {
            this.users = users;
            this.loading = false;
            this.firstSearchDone = true;
        }, () => this.loading = false);
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
AddManagerDialogComponent = __decorate([
    Component({
        selector: 'app-add-manager-dialog',
        templateUrl: './add-manager-dialog.component.html',
        styleUrls: ['./add-manager-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, AuthzResolverService,
        UsersManagerService,
        TranslateService,
        NotificatorService,
        StoreService,
        ActivatedRoute,
        Router,
        TableConfigService])
], AddManagerDialogComponent);
export { AddManagerDialogComponent };
//# sourceMappingURL=add-manager-dialog.component.js.map