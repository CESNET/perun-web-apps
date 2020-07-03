import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { GroupsManagerService, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
let AddMemberToResourceComponent = class AddMemberToResourceComponent {
    constructor(dialogRef, data, resourceManager, groupManager, notificator, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.resourceManager = resourceManager;
        this.groupManager = groupManager;
        this.notificator = notificator;
        this.translate = translate;
        this.membersGroupsId = new Set();
        this.facilityCtrl = new FormControl();
        this.facilitiesNames = [];
        this.resources = [];
        this.selectedResource = null;
        this.services = [];
        this.description = "";
        this.groups = [];
        this.selectedGroups = new SelectionModel(false, []);
    }
    ngOnInit() {
        this.theme = this.data.theme;
        this.resourceManager.getRichResources(this.data.voId).subscribe(resources => {
            this.resources = resources;
            this.getResourceFacilities();
        });
    }
    getResourceFacilities() {
        const distinctFacilities = new Set();
        for (const resource of this.resources) {
            distinctFacilities.add(resource.facility.name);
        }
        this.facilitiesNames = Array.from(distinctFacilities);
        this.filteredFacilities = this.facilityCtrl.valueChanges.pipe(startWith(''), map(value => this.filterFacilities(value)));
        this.filteredResources = this.facilityCtrl.valueChanges.pipe(startWith(''), map(value => this.filterResources(value)));
    }
    filterFacilities(value) {
        const filterValue = value.toLowerCase();
        const filtered = this.facilitiesNames.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
        return filtered.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }
    filterResources(value) {
        if (value == null) {
            return this.resources;
        }
        const filterValue = value.toLowerCase();
        const filtered = this.resources.filter(option => option.facility.name.toLowerCase().indexOf(filterValue) === 0);
        return filtered.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }
    setResource(resource) {
        this.selectedResource = resource;
        this.resourceManager.getAssignedServicesToResource(this.selectedResource.id).subscribe(services => {
            this.services = services;
        });
        this.description = this.selectedResource.description;
    }
    loadGroups() {
        this.resourceManager.getAssignedGroups(this.selectedResource.id).subscribe(groups => {
            this.groups = groups;
        });
        this.groupManager.getAllMemberGroups(this.data.memberId).subscribe(groups => {
            this.membersGroupsId = new Set(groups.map(group => group.id));
        });
    }
    onFinish() {
        const groupId = this.selectedGroups.selected[0].id;
        this.groupManager.addMembers(groupId, [this.data.memberId]).subscribe(() => {
            this.notificator.showSuccess(this.translate.instant('DIALOGS.ADD_MEMBER_TO_RESOURCE.SUCCESS'));
            this.dialogRef.close(true);
        });
    }
    onCancel() {
        this.dialogRef.close(false);
    }
};
AddMemberToResourceComponent = __decorate([
    Component({
        selector: 'app-add-member-to-resource',
        templateUrl: './add-member-to-resource.component.html',
        styleUrls: ['./add-member-to-resource.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, ResourcesManagerService,
        GroupsManagerService,
        NotificatorService,
        TranslateService])
], AddMemberToResourceComponent);
export { AddMemberToResourceComponent };
//# sourceMappingURL=add-member-to-resource.component.js.map