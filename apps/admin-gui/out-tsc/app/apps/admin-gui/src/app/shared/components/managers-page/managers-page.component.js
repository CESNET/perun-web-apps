import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AddManagerDialogComponent } from '../dialogs/add-manager-dialog/add-manager-dialog.component';
import { RemoveManagerDialogComponent } from '../dialogs/remove-manager-dialog/remove-manager-dialog.component';
import { RemoveGroupManagerDialogComponent } from '../dialogs/remove-group-manager-dialog/remove-group-manager-dialog.component';
import { AddGroupManagerDialogComponent } from '../dialogs/add-group-manager-dialog/add-group-manager-dialog.component';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { TABLE_GROUP_MANAGERS_PAGE, TableConfigService } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { StoreService } from '@perun-web-apps/perun/services';
let ManagersPageComponent = class ManagersPageComponent {
    constructor(dialog, tableConfigService, authzService, storeService) {
        this.dialog = dialog;
        this.tableConfigService = tableConfigService;
        this.authzService = authzService;
        this.storeService = storeService;
        this.groups = null;
        this.managers = null;
        this.selectionUsers = new SelectionModel(true, []);
        this.selectionGroups = new SelectionModel(true, []);
        this.selected = 'user';
        this.loading = false;
        this.tableId = TABLE_GROUP_MANAGERS_PAGE;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.selectedRole = this.availableRoles[0];
        this.changeUser();
    }
    changeUser() {
        this.loading = true;
        let attributes = [
            Urns.USER_DEF_ORGANIZATION,
            Urns.USER_DEF_PREFERRED_MAIL
        ];
        attributes = attributes.concat(this.storeService.getLoginAttributeNames());
        if (this.selected === 'user') {
            this.authzService.getAuthzRichAdmins(this.selectedRole, this.complementaryObject.id, this.complementaryObjectType, attributes, false, true).subscribe(managers => {
                this.managers = managers;
                this.selectionUsers.clear();
                this.selectionGroups.clear();
                this.loading = false;
            }, () => {
                this.loading = false;
            });
        }
        if (this.selected === 'group') {
            this.authzService.getAuthzAdminGroups(this.selectedRole, this.complementaryObject.id, this.complementaryObjectType).subscribe(groups => {
                this.groups = groups;
                this.selectionUsers.clear();
                this.selectionGroups.clear();
                this.loading = false;
            }, () => {
                this.loading = false;
            });
        }
    }
    addManager() {
        const config = getDefaultDialogConfig();
        config.width = '1000px';
        config.data = {
            complementaryObject: this.complementaryObject,
            theme: this.theme,
            availableRoles: this.availableRoles,
            selectedRole: this.selectedRole
        };
        const dialogRef = this.dialog.open(AddManagerDialogComponent, config);
        dialogRef.afterClosed().subscribe(() => {
            this.changeUser();
        });
    }
    removeManager() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            managers: this.selectionUsers.selected,
            complementaryObject: this.complementaryObject,
            role: this.selectedRole,
            theme: this.theme
        };
        const dialogRef = this.dialog.open(RemoveManagerDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.changeUser();
            }
        });
    }
    removeGroup() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            groups: this.selectionGroups.selected,
            complementaryObject: this.complementaryObject,
            role: this.selectedRole,
            theme: this.theme
        };
        const dialogRef = this.dialog.open(RemoveGroupManagerDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.changeUser();
            }
        });
    }
    addGroup() {
        const config = getDefaultDialogConfig();
        config.width = '1000px';
        config.data = {
            complementaryObject: this.complementaryObject,
            availableRoles: this.availableRoles,
            theme: this.theme,
            selectedRole: this.selectedRole
        };
        const dialogRef = this.dialog.open(AddGroupManagerDialogComponent, config);
        dialogRef.afterClosed().subscribe(() => {
            this.changeUser();
        });
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], ManagersPageComponent.prototype, "true", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ManagersPageComponent.prototype, "complementaryObject", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ManagersPageComponent.prototype, "availableRoles", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ManagersPageComponent.prototype, "complementaryObjectType", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ManagersPageComponent.prototype, "theme", void 0);
ManagersPageComponent = __decorate([
    Component({
        selector: 'app-managers-page',
        templateUrl: './managers-page.component.html',
        styleUrls: ['./managers-page.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        TableConfigService,
        AuthzResolverService,
        StoreService])
], ManagersPageComponent);
export { ManagersPageComponent };
//# sourceMappingURL=managers-page.component.js.map