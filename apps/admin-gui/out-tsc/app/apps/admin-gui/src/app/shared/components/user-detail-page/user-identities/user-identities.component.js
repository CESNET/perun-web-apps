import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { RegistrarManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { RemoveUserExtSourceDialogComponent } from '@perun-web-apps/perun/components';
import { AddUserExtSourceDialogComponent } from '../../dialogs/add-user-ext-source-dialog/add-user-ext-source-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let UserIdentitiesComponent = class UserIdentitiesComponent {
    constructor(usersManagerService, storage, registrarManagerService, dialog, route) {
        this.usersManagerService = usersManagerService;
        this.storage = storage;
        this.registrarManagerService = registrarManagerService;
        this.dialog = dialog;
        this.route = route;
        this.userExtSources = [];
        this.selection = new SelectionModel(false, []);
        this.hiddenColumns = ['mail'];
    }
    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.userId = params['userId'];
        });
        this.refreshTable();
    }
    refreshTable() {
        this.loading = true;
        this.selection.clear();
        this.usersManagerService.getRichUserExtSources(this.userId).subscribe(userExtSources => {
            this.userExtSources = userExtSources;
            this.loading = false;
        }, () => this.loading = false);
    }
    addIdentity() {
        const config = getDefaultDialogConfig();
        config.width = '400px';
        config.data = { userId: this.userId };
        const dialogRef = this.dialog.open(AddUserExtSourceDialogComponent, config);
        dialogRef.afterClosed().subscribe(success => {
            if (success) {
                this.refreshTable();
            }
        });
    }
    removeIdentity() {
        const config = getDefaultDialogConfig();
        config.width = '400px';
        config.data = {
            showSuccess: true,
            theme: 'user-theme',
            userId: this.userId,
            extSources: this.selection.selected
        };
        const dialogRef = this.dialog.open(RemoveUserExtSourceDialogComponent, config);
        dialogRef.afterClosed().subscribe(success => {
            if (success) {
                this.refreshTable();
            }
        });
    }
};
UserIdentitiesComponent = __decorate([
    Component({
        selector: 'app-user-identities',
        templateUrl: './user-identities.component.html',
        styleUrls: ['./user-identities.component.scss']
    }),
    __metadata("design:paramtypes", [UsersManagerService,
        StoreService,
        RegistrarManagerService,
        MatDialog,
        ActivatedRoute])
], UserIdentitiesComponent);
export { UserIdentitiesComponent };
//# sourceMappingURL=user-identities.component.js.map