import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
let RemoveRelationDialogComponent = class RemoveRelationDialogComponent {
    constructor(dialogRef, data, notificator, groupService, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.groupService = groupService;
        this.translate = translate;
        this.displayedColumns = ['name'];
        translate.get('DIALOGS.REMOVE_RELATION.SUCCESS').subscribe(value => this.successMessage = value);
    }
    ngOnInit() {
        this.theme = this.data.theme;
        this.dataSource = new MatTableDataSource(this.data.groups);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        if (this.data.groups.length === 1) {
            const thisGroup = this.data.reverse ? this.data.groups[0].id : this.data.groupId;
            const otherGroup = this.data.reverse ? this.data.groupId : this.data.groups[0].id;
            this.groupService.removeGroupUnion(thisGroup, otherGroup).subscribe(() => {
                this.notificator.showSuccess(this.successMessage);
                this.loading = false;
                this.dialogRef.close(true);
            }, () => this.loading = false);
        }
        else {
            const thisGroup = this.data.reverse ? this.data.groups.shift().id : this.data.groupId;
            const otherGroup = this.data.reverse ? this.data.groupId : this.data.groups.shift().id;
            this.groupService.removeGroupUnion(thisGroup, otherGroup).subscribe(() => {
                this.onSubmit();
                this.dialogRef.close(true);
            }, () => this.loading = false);
        }
    }
};
RemoveRelationDialogComponent = __decorate([
    Component({
        selector: 'app-remove-relation-dialog',
        templateUrl: './remove-relation-dialog.component.html',
        styleUrls: ['./remove-relation-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        GroupsManagerService,
        TranslateService])
], RemoveRelationDialogComponent);
export { RemoveRelationDialogComponent };
//# sourceMappingURL=remove-relation-dialog.component.js.map