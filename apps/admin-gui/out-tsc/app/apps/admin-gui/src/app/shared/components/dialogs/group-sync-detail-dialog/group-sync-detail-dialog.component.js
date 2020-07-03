import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { getAttribute } from '@perun-web-apps/perun/utils';
import { NotificatorService } from '@perun-web-apps/perun/services';
let GroupSyncDetailDialogComponent = class GroupSyncDetailDialogComponent {
    constructor(dialogRef, group, groupService, notificator) {
        this.dialogRef = dialogRef;
        this.group = group;
        this.groupService = groupService;
        this.notificator = notificator;
        this.loading = false;
    }
    ngOnInit() {
        this.syncEnabled = getAttribute(this.group.attributes, Urns.GROUP_SYNC_ENABLED).value;
        this.lastSyncState = getAttribute(this.group.attributes, Urns.GROUP_LAST_SYNC_STATE).value;
        this.lastSyncTime = getAttribute(this.group.attributes, Urns.GROUP_LAST_SYNC_TIMESTAMP).value;
        this.structSyncEnabled = getAttribute(this.group.attributes, Urns.GROUP_STRUCTURE_SYNC_ENABLED).value;
        this.lastStructSyncState = getAttribute(this.group.attributes, Urns.GROUP_LAST_STRUCTURE_SYNC_STATE).value;
        this.lastStructSyncTime = getAttribute(this.group.attributes, Urns.GROUP_LAST_STRUCTURE_SYNC_TIMESTAMP).value;
        if (this.syncEnabled !== null && this.syncEnabled === 'true') {
            this.type = 'BASIC';
        }
        if (this.structSyncEnabled !== null && this.structSyncEnabled) {
            this.type = 'STRUCTURED';
        }
    }
    onCancel() {
        this.dialogRef.close(null);
    }
    onForce() {
        this.loading = true;
        if (this.isBasic()) {
            this.groupService.forceGroupSynchronization(this.group.id).subscribe(() => {
                this.notificator.showSuccess('DIALOGS.GROUP_SYNC_DETAIL.FORCE_SUCCESS');
                this.dialogRef.close();
            }, () => this.loading = false);
        }
        if (this.isStructured()) {
            this.groupService.forceGroupStructureSynchronization(this.group.id).subscribe(() => {
                this.notificator.showSuccess('DIALOGS.GROUP_SYNC_DETAIL.FORCE_SUCCESS');
                this.dialogRef.close();
            }, () => this.loading = false);
        }
    }
    getSynchronizationType() {
        if (this.isBasic()) {
            return 'DIALOGS.GROUP_SYNC_DETAIL.NORMAL_SYNC';
        }
        if (this.isStructured()) {
            return 'DIALOGS.GROUP_SYNC_DETAIL.STRUCT_SYNC';
        }
        return "N/A";
    }
    isBasic() {
        return this.type === 'BASIC';
    }
    isStructured() {
        return this.type === 'STRUCTURED';
    }
    getLastSyncState() {
        if (this.isBasic()) {
            return this.lastSyncState !== '' ? this.lastSyncState : 'OK';
        }
        if (this.isStructured()) {
            return this.lastStructSyncState !== '' ? this.lastStructSyncState : 'OK';
        }
        return 'N/A';
    }
    getLastSyncTime() {
        if (this.isBasic()) {
            return this.lastSyncTime;
        }
        if (this.isStructured()) {
            return this.lastStructSyncTime;
        }
        return 'N/A';
    }
};
GroupSyncDetailDialogComponent = __decorate([
    Component({
        selector: 'app-group-sync-detail-dialog',
        templateUrl: './group-sync-detail-dialog.component.html',
        styleUrls: ['./group-sync-detail-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, GroupsManagerService,
        NotificatorService])
], GroupSyncDetailDialogComponent);
export { GroupSyncDetailDialogComponent };
//# sourceMappingURL=group-sync-detail-dialog.component.js.map