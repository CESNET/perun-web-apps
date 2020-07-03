import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { MembersService } from '@perun-web-apps/perun/services';
let RemoveMembersDialogComponent = class RemoveMembersDialogComponent {
    constructor(dialogRef, data, membersService, groupService, notificator, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.membersService = membersService;
        this.groupService = groupService;
        this.notificator = notificator;
        this.translate = translate;
        this.displayedColumns = ['id', 'name'];
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.members);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        if (!!this.data.groupId) {
            this.groupService.removeMembers(this.data.groupId, this.data.members.map(m => m.id))
                .subscribe(() => this.onSuccess(), () => this.onError());
        }
        else {
            this.membersService.deleteMembers(this.data.members.map(m => m.id))
                .subscribe(() => this.onSuccess(), () => this.onError());
        }
    }
    onSuccess() {
        const message = !!this.data.groupId ?
            this.translate.instant('DIALOGS.REMOVE_MEMBERS.SUCCESS_GROUP') :
            this.translate.instant('DIALOGS.REMOVE_MEMBERS.SUCCESS');
        this.notificator.showSuccess(message);
        this.dialogRef.close(true);
        this.loading = false;
    }
    onError() {
        this.loading = false;
    }
};
RemoveMembersDialogComponent = __decorate([
    Component({
        selector: 'app-remove-members-dialog',
        templateUrl: './remove-members-dialog.component.html',
        styleUrls: ['./remove-members-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, MembersService,
        GroupsManagerService,
        NotificatorService,
        TranslateService])
], RemoveMembersDialogComponent);
export { RemoveMembersDialogComponent };
//# sourceMappingURL=remove-members-dialog.component.js.map