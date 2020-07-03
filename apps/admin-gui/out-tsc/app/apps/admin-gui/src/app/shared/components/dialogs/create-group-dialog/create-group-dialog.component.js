import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
let CreateGroupDialogComponent = class CreateGroupDialogComponent {
    constructor(dialogRef, data, groupService, translate, notificator) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.groupService = groupService;
        this.translate = translate;
        this.notificator = notificator;
        this.name = '';
        this.description = '';
        this.isNotSubGroup = (this.data.parentGroup === null);
        if (this.isNotSubGroup) {
            translate.get('DIALOGS.CREATE_GROUP.TITLE').subscribe(value => this.title = value);
        }
        else {
            translate.get('DIALOGS.CREATE_GROUP.TITLE_SUB_GROUP').subscribe(value => {
                this.title = value + this.data.parentGroup.name;
            });
        }
        translate.get('DIALOGS.CREATE_GROUP.SUCCESS').subscribe(value => this.successMessage = value);
        translate.get('DIALOGS.CREATE_GROUP.SUCCESS_SUBGROUP').subscribe(value => this.successSubGroupMessage = value);
    }
    onCancel() {
        this.dialogRef.close();
    }
    onSubmit() {
        if (this.isNotSubGroup) {
            this.groupService.createGroupWithVoNameDescription(this.data.voId, this.name, this.description).subscribe(() => {
                this.notificator.showSuccess(this.successMessage);
                this.dialogRef.close(true);
            });
        }
        else {
            this.groupService.createGroupWithParentGroupNameDescription(this.data.parentGroup.id, this.name, this.description).subscribe(() => {
                this.notificator.showSuccess(this.successSubGroupMessage);
                this.dialogRef.close(true);
            });
        }
    }
};
CreateGroupDialogComponent = __decorate([
    Component({
        selector: 'app-create-group-dialog',
        templateUrl: './create-group-dialog.component.html',
        styleUrls: ['./create-group-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, GroupsManagerService,
        TranslateService,
        NotificatorService])
], CreateGroupDialogComponent);
export { CreateGroupDialogComponent };
//# sourceMappingURL=create-group-dialog.component.js.map