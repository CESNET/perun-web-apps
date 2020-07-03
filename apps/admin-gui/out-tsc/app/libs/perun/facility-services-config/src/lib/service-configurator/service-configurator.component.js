import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ATTRIBUTES_SETTINGS, TableConfigService } from '@perun-web-apps/config/table-config';
import { AttributesListComponent, CreateAttributeDialogComponent, EditAttributeDialogComponent } from '@perun-web-apps/perun/components';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let ServiceConfiguratorComponent = class ServiceConfiguratorComponent {
    constructor(attributesManager, tableConfigService, dialog) {
        this.attributesManager = attributesManager;
        this.tableConfigService = tableConfigService;
        this.dialog = dialog;
        this.selectionFacility = new SelectionModel(true, []);
        this.selectionResource = new SelectionModel(true, []);
        this.selectionGroup = new SelectionModel(true, []);
        this.selectionMember = new SelectionModel(true, []);
        this.showTab = 0;
        this.tableId = TABLE_ATTRIBUTES_SETTINGS;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.loadFacilityAttributes();
    }
    ngOnChanges(changes) {
        if (changes['service']) {
            this.reloadAll();
            return;
        }
        if (changes['resource']) {
            if (changes['resource'].currentValue === undefined) {
                this.resourceAttributes = undefined;
                this.showTab = 0;
            }
            else {
                this.showTab = 1;
                this.loadResourceAttributes();
            }
        }
        else if (changes['group']) {
            if (changes['group'].currentValue === undefined) {
                this.groupAttributes = undefined;
                this.showTab = 1;
            }
            else {
                this.showTab = 2;
                this.attributesManager.getGroupAttributes(this.group.id).subscribe(attrs => this.groupAttributes = attrs);
            }
        }
        else if (changes['member']) {
            if (changes['member'].currentValue === undefined) {
                this.memberAttributes = undefined;
                this.showTab = 2;
            }
            else {
                this.showTab = 3;
                this.attributesManager.getMemberAttributes(this.member.id).subscribe(attrs => this.memberAttributes = attrs);
            }
        }
    }
    loadResourceAttributes() {
        if (this.service === 'NOT_SELECTED') {
            this.attributesManager
                .getResourceAttributes(this.resource.id)
                .subscribe(attrs => this.resourceAttributes = attrs);
        }
        else if (this.service === 'ALL') {
            this.attributesManager
                .getRequiredAttributesResource(this.resource.id)
                .subscribe(attrs => this.resourceAttributes = attrs);
        }
        else {
            this.attributesManager
                .getRequiredAttributesResourceService(this.service.id, this.resource.id)
                .subscribe(attrs => this.resourceAttributes = attrs);
        }
    }
    loadFacilityAttributes() {
        if (this.service === 'NOT_SELECTED') {
            this.attributesManager
                .getFacilityAttributes(this.facility.id)
                .subscribe(attrs => this.facilityAttributes = attrs);
        }
        else if (this.service === 'ALL') {
            this.attributesManager
                .getRequiredAttributesFacility(this.facility.id)
                .subscribe(attrs => this.facilityAttributes = attrs);
        }
        else {
            this.attributesManager
                .getRequiredAttributesFacilityService(this.service.id, this.facility.id)
                .subscribe(attrs => this.facilityAttributes = attrs);
        }
    }
    reloadAll() {
        this.loadFacilityAttributes();
        if (this.resource !== undefined) {
            this.loadResourceAttributes();
        }
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
    onAddAttFacility() {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            entityId: this.facility.id,
            entity: 'facility',
            notEmptyAttributes: this.facilityAttributes,
            style: 'facility-theme'
        };
        const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'saved') {
                this.reloadAll();
            }
        });
    }
    onSaveFacility() {
        this.facilityAlist.updateMapAttributes();
        const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
            width: '450px',
            data: {
                entityId: this.facility.id,
                entity: 'facility',
                attributes: this.selectionFacility.selected
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectionFacility.clear();
                this.ngOnInit();
            }
        });
    }
    onAddAttResource() {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            entityId: this.resource.id,
            entity: 'resource',
            notEmptyAttributes: this.resourceAttributes,
            style: 'facility-theme'
        };
        const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'saved') {
                this.reloadAll();
            }
        });
    }
    onSaveResource() {
        this.resourceAList.updateMapAttributes();
        const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
            width: '450px',
            data: {
                entityId: this.resource.id,
                entity: 'resource',
                attributes: this.selectionResource.selected
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectionResource.clear();
                this.ngOnInit();
            }
        });
    }
    onAddAttGroup() {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            entityId: this.group.id,
            entity: 'group',
            notEmptyAttributes: this.groupAttributes,
            style: 'facility-theme'
        };
        const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'saved') {
                this.reloadAll();
            }
        });
    }
    onSaveGroup() {
        this.groupAList.updateMapAttributes();
        const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
            width: '450px',
            data: {
                entityId: this.group.id,
                entity: 'group',
                attributes: this.selectionGroup.selected
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectionGroup.clear();
                this.ngOnInit();
            }
        });
    }
    onAddAttMember() {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            entityId: this.member.id,
            entity: 'member',
            notEmptyAttributes: this.memberAttributes,
            style: 'facility-theme'
        };
        const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'saved') {
                this.reloadAll();
            }
        });
    }
    onSaveMember() {
        this.memberAList.updateMapAttributes();
        const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
            width: '450px',
            data: {
                entityId: this.member.id,
                entity: 'member',
                attributes: this.selectionMember.selected
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectionMember.clear();
                this.ngOnInit();
            }
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ServiceConfiguratorComponent.prototype, "facility", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ServiceConfiguratorComponent.prototype, "service", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ServiceConfiguratorComponent.prototype, "resource", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ServiceConfiguratorComponent.prototype, "group", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ServiceConfiguratorComponent.prototype, "member", void 0);
__decorate([
    ViewChild('FacilityAList'),
    __metadata("design:type", AttributesListComponent)
], ServiceConfiguratorComponent.prototype, "facilityAlist", void 0);
__decorate([
    ViewChild('ResourceAList'),
    __metadata("design:type", AttributesListComponent)
], ServiceConfiguratorComponent.prototype, "resourceAList", void 0);
__decorate([
    ViewChild('GroupAList'),
    __metadata("design:type", AttributesListComponent)
], ServiceConfiguratorComponent.prototype, "groupAList", void 0);
__decorate([
    ViewChild('MemberAList'),
    __metadata("design:type", AttributesListComponent)
], ServiceConfiguratorComponent.prototype, "memberAList", void 0);
ServiceConfiguratorComponent = __decorate([
    Component({
        selector: 'perun-web-apps-service-configurator',
        templateUrl: './service-configurator.component.html',
        styleUrls: ['./service-configurator.component.scss']
    }),
    __metadata("design:paramtypes", [AttributesManagerService,
        TableConfigService,
        MatDialog])
], ServiceConfiguratorComponent);
export { ServiceConfiguratorComponent };
//# sourceMappingURL=service-configurator.component.js.map