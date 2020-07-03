import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { openClose } from '@perun-web-apps/perun/animations';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { ApiRequestConfigurationService } from '@perun-web-apps/perun/services';
let MoveGroupDialogComponent = class MoveGroupDialogComponent {
    constructor(dialogRef, data, groupService, notificator, translate, apiRequest) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.groupService = groupService;
        this.notificator = notificator;
        this.translate = translate;
        this.apiRequest = apiRequest;
        this.toRootOptionDisabled = false;
        this.toGroupOptionDisabled = false;
        this.otherGroups = [];
        this.otherGroupsCtrl = new FormControl();
        this.loading = false;
        this.translate.get('DIALOGS.MOVE_GROUP.SUCCESS').subscribe(value => this.successMessage = value);
        this.translate.get('DIALOGS.MOVE_GROUP.ERROR').subscribe(value => this.errorMessage = value);
    }
    ngOnInit() {
        this.groupService.getAllGroups(this.data.group.voId).subscribe(allGroups => {
            this.otherGroups = allGroups.filter(group => group.id !== this.data.group.id && group.name !== 'members');
            if (this.data.group.parentGroupId === null) {
                this.toRootOptionDisabled = true;
                this.moveOption = 'toGroup';
            }
            this.filteredGroups = this.otherGroupsCtrl.valueChanges
                .pipe(startWith(''), map(group => group ? this._filterGroups(group) : this.otherGroups.slice()));
        });
    }
    // Hack that ensures proper autocomplete value displaying
    displayFn(group) {
        return group ? group.name : group;
    }
    _filterGroups(value) {
        // Hack that ensures proper autocomplete value displaying
        if (typeof value === 'object') {
            return [];
        }
        const filterValue = value.toLowerCase();
        return value ? this.otherGroups.filter(group => group.name.toLowerCase().indexOf(filterValue) > -1) : this.otherGroups;
    }
    close() {
        this.dialogRef.close();
    }
    confirm() {
        this.loading = true;
        // FIXME this might not work in case of some race condition (other request finishes sooner)
        this.apiRequest.dontHandleErrorForNext();
        this.groupService.moveGroupWithDestinationGroupMovingGroup(this.data.group.id, this.otherGroupsCtrl.value ? this.otherGroupsCtrl.value.id : undefined).subscribe(() => {
            this.notificator.showSuccess(this.successMessage);
            this.dialogRef.close(true);
        }, (error => {
            this.notificator.showRPCError(error, this.errorMessage);
            this.dialogRef.close(false);
        }));
    }
};
MoveGroupDialogComponent = __decorate([
    Component({
        selector: 'app-move-group-dialog',
        templateUrl: './move-group-dialog.component.html',
        styleUrls: ['./move-group-dialog.component.scss'],
        animations: [
            openClose
        ]
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, GroupsManagerService,
        NotificatorService,
        TranslateService,
        ApiRequestConfigurationService])
], MoveGroupDialogComponent);
export { MoveGroupDialogComponent };
//# sourceMappingURL=move-group-dialog.component.js.map