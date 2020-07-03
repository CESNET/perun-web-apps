import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
let RemoveManagerDialogComponent = class RemoveManagerDialogComponent {
    constructor(dialogRef, data, notificator, translate, authzService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.authzService = authzService;
        this.displayedColumns = ['name'];
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.managers);
        this.theme = this.data.theme;
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        this.authzService.unsetRoleWithUserComplementaryObject({ role: this.data.role, users: this.data.managers.map(manager => manager.id), complementaryObject: this.data.complementaryObject })
            .subscribe(() => {
            this.translate.get('DIALOGS.REMOVE_MANAGERS.SUCCESS').subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
                this.loading = false;
                this.dialogRef.close(true);
            }, () => this.loading = false);
        }, () => this.loading = false);
    }
};
RemoveManagerDialogComponent = __decorate([
    Component({
        selector: 'app-remove-manager-dialog',
        templateUrl: './remove-manager-dialog.component.html',
        styleUrls: ['./remove-manager-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        AuthzResolverService])
], RemoveManagerDialogComponent);
export { RemoveManagerDialogComponent };
//# sourceMappingURL=remove-manager-dialog.component.js.map