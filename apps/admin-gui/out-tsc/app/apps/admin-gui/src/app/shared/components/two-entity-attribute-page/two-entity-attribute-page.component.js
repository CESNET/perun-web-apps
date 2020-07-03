import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttributesManagerService, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { AttributesListComponent, EditAttributeDialogComponent } from '@perun-web-apps/perun/components';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteAttributeDialogComponent } from '../dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { CreateAttributeDialogComponent } from '../dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let TwoEntityAttributePageComponent = class TwoEntityAttributePageComponent {
    constructor(route, attributesManagerService, resourcesManagerService, dialog) {
        this.route = route;
        this.attributesManagerService = attributesManagerService;
        this.resourcesManagerService = resourcesManagerService;
        this.dialog = dialog;
        this.attributes = [];
        this.selection = new SelectionModel(true, []);
        this.filter = '';
        this.filteredEntityValues = [];
    }
    ngOnChanges() {
        this.filteredEntityValues = this.entityValues;
    }
    getAttributes(entityId) {
        this.innerLoading = true;
        switch (this.firstEntity) {
            case 'member':
                switch (this.secondEntity) {
                    case 'resource':
                        this.attributesManagerService.getMemberResourceAttributes(this.firstEntityId, entityId).subscribe(attributes => {
                            this.attributes = attributes;
                            this.innerLoading = false;
                        });
                        break;
                    case 'group':
                        this.attributesManagerService.getMemberGroupAttributes(this.firstEntityId, entityId).subscribe(attributes => {
                            this.attributes = attributes;
                            this.innerLoading = false;
                        });
                }
                break;
            case 'group':
                this.attributesManagerService.getGroupResourceAttributes(this.firstEntityId, entityId).subscribe(attributes => {
                    this.attributes = attributes;
                    this.innerLoading = false;
                });
                break;
            case 'user':
                this.attributesManagerService.getUserFacilityAttributes(this.firstEntityId, entityId).subscribe(attributes => {
                    this.attributes = attributes;
                    this.innerLoading = false;
                });
                break;
        }
    }
    applyFilter(filterValue) {
        this.filter = filterValue;
        this.filteredEntityValues = this.entityValues.filter(res => res.name.toLowerCase().includes(filterValue.toLowerCase()));
    }
    onSave(entityId) {
        // have to use this to update attribute with map in it, before saving it
        this.list.updateMapAttributes();
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            entityId: this.firstEntityId,
            entity: this.firstEntity,
            secondEntity: this.secondEntity,
            secondEntityId: entityId,
            attributes: this.selection.selected
        };
        const dialogRef = this.dialog.open(EditAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selection.clear();
                this.getAttributes(entityId);
            }
        });
    }
    onDelete(entityId) {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            entityId: this.firstEntityId,
            entity: this.firstEntity,
            secondEntity: this.secondEntity,
            secondEntityId: entityId,
            attributes: this.selection.selected
        };
        const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(didConfirm => {
            if (didConfirm) {
                this.selection.clear();
                this.getAttributes(entityId);
            }
        });
    }
    onAdd(entityId) {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            entityId: this.firstEntityId,
            entity: this.firstEntity,
            secondEntity: this.secondEntity,
            secondEntityId: entityId,
            notEmptyAttributes: this.attributes,
            style: `${this.firstEntity}-theme`
        };
        const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selection.clear();
                this.getAttributes(entityId);
            }
        });
    }
};
__decorate([
    ViewChild('list'),
    __metadata("design:type", AttributesListComponent)
], TwoEntityAttributePageComponent.prototype, "list", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], TwoEntityAttributePageComponent.prototype, "firstEntityId", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TwoEntityAttributePageComponent.prototype, "firstEntity", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TwoEntityAttributePageComponent.prototype, "secondEntity", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], TwoEntityAttributePageComponent.prototype, "entityValues", void 0);
TwoEntityAttributePageComponent = __decorate([
    Component({
        selector: 'app-two-entity-attribute-page',
        templateUrl: './two-entity-attribute-page.component.html',
        styleUrls: ['./two-entity-attribute-page.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        AttributesManagerService,
        ResourcesManagerService,
        MatDialog])
], TwoEntityAttributePageComponent);
export { TwoEntityAttributePageComponent };
//# sourceMappingURL=two-entity-attribute-page.component.js.map