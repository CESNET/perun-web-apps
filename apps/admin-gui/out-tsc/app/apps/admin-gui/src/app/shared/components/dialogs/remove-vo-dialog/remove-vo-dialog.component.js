import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
let RemoveVoDialogComponent = class RemoveVoDialogComponent {
    constructor(dialogRef, data, notificator, voService, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.voService = voService;
        this.translate = translate;
        this.force = false;
        this.displayedColumns = ['name'];
        translate.get('DIALOGS.REMOVE_VO.SUCCESS').subscribe(value => this.successMessage = value);
    }
    ngOnInit() {
        this.theme = this.data.theme;
        this.dataSource = new MatTableDataSource(this.data.vos);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        //TODO Works for one Vo at the time, in future there may be need to remove  more Vos at once
        this.voService.deleteVo(this.data.vos[0].id, this.force).subscribe(() => {
            this.notificator.showSuccess(this.successMessage);
            this.loading = false;
            this.dialogRef.close(true);
        }, () => this.loading = false);
    }
};
RemoveVoDialogComponent = __decorate([
    Component({
        selector: 'app-remove-vo-dialog',
        templateUrl: './remove-vo-dialog.component.html',
        styleUrls: ['./remove-vo-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        VosManagerService,
        TranslateService])
], RemoveVoDialogComponent);
export { RemoveVoDialogComponent };
//# sourceMappingURL=remove-vo-dialog.component.js.map