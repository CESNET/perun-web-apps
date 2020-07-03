import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
let RemoveGroupManagerDialogComponent = class RemoveGroupManagerDialogComponent {
    constructor(dialogRef, data, notificator, translate, authzService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.authzService = authzService;
        this.displayedColumns = ['name'];
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.groups);
        this.theme = this.data.theme;
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        this.authzService.unsetRoleWithGroupComplementaryObject({ role: this.data.role, authorizedGroups: this.data.groups.map(group => group.id), complementaryObject: this.data.complementaryObject })
            .subscribe(() => {
            this.translate.get('DIALOGS.REMOVE_GROUPS.SUCCESS').subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
                this.loading = false;
                this.dialogRef.close(true);
            }, () => this.loading = false);
        }, () => this.loading = false);
    }
};
RemoveGroupManagerDialogComponent = __decorate([
    Component({
        selector: 'app-remove-group-manager-dialog',
        templateUrl: './remove-group-manager-dialog.component.html',
        styleUrls: ['./remove-group-manager-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        AuthzResolverService])
], RemoveGroupManagerDialogComponent);
export { RemoveGroupManagerDialogComponent };
//# sourceMappingURL=remove-group-manager-dialog.component.js.map