import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
let DeleteGroupDialogComponent = class DeleteGroupDialogComponent {
    constructor(dialogRef, data, notificator, translate, groupService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.groupService = groupService;
        this.displayedColumns = ['name'];
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.groups);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.groupService.deleteGroups(this.data.groups.map(elem => elem.id), true).subscribe(() => {
            this.translate.get('DIALOGS.DELETE_GROUP.SUCCESS').subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close(true);
            });
        });
    }
};
DeleteGroupDialogComponent = __decorate([
    Component({
        selector: 'app-delete-group-dialog',
        templateUrl: './delete-group-dialog.component.html',
        styleUrls: ['./delete-group-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        GroupsManagerService])
], DeleteGroupDialogComponent);
export { DeleteGroupDialogComponent };
//# sourceMappingURL=delete-group-dialog.component.js.map