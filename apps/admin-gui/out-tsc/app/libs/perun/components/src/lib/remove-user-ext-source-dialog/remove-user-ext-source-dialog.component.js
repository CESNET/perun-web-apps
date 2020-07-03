import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
let RemoveUserExtSourceDialogComponent = class RemoveUserExtSourceDialogComponent {
    constructor(dialogRef, data, usersManagerService, translate, notificator) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.usersManagerService = usersManagerService;
        this.translate = translate;
        this.notificator = notificator;
        this.force = false;
        this.displayedColumns = ['name'];
        translate.get('SHARED_LIB.PERUN.COMPONENTS.REMOVE_USER_EXT_SOURCE.SUCCESS').subscribe(res => this.successMessage = res);
    }
    ngOnInit() {
        this.theme = this.data.theme;
        this.dataSource = new MatTableDataSource(this.data.extSources);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        if (this.data.extSources.length) {
            this.usersManagerService.removeUserExtSource(this.data.userId, this.data.extSources.pop().userExtSource.id, this.force).subscribe(() => {
                this.onSubmit();
            }, () => this.loading = false);
        }
        else {
            this.loading = false;
            if (this.data.showSuccess) {
                this.notificator.showSuccess(this.successMessage);
            }
            this.dialogRef.close(true);
        }
    }
};
RemoveUserExtSourceDialogComponent = __decorate([
    Component({
        selector: 'perun-web-apps-remove-user-ext-source-dialog',
        templateUrl: './remove-user-ext-source-dialog.component.html',
        styleUrls: ['./remove-user-ext-source-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, UsersManagerService,
        TranslateService,
        NotificatorService])
], RemoveUserExtSourceDialogComponent);
export { RemoveUserExtSourceDialogComponent };
//# sourceMappingURL=remove-user-ext-source-dialog.component.js.map