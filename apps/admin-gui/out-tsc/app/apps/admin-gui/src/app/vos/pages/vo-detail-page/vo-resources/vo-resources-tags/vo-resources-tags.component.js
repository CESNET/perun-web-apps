import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateResourceTagDialogComponent } from '../../../../../shared/components/dialogs/create-resource-tag-dialog/create-resource-tag-dialog.component';
import { DeleteResourceTagDialogComponent } from '../../../../../shared/components/dialogs/delete-resource-tag-dialog/delete-resource-tag-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_VO_RESOURCES_TAGS, TableConfigService } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let VoResourcesTagsComponent = class VoResourcesTagsComponent {
    constructor(route, resourceManager, dialog, notificator, tableConfigService, translator) {
        this.route = route;
        this.resourceManager = resourceManager;
        this.dialog = dialog;
        this.notificator = notificator;
        this.tableConfigService = tableConfigService;
        this.translator = translator;
        this.loading = false;
        this.resourceTag = [];
        this.selection = new SelectionModel(true, []);
        this.tableId = TABLE_VO_RESOURCES_TAGS;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.parent.params.subscribe(parentParams => {
            this.voId = parentParams['voId'];
            this.updateData();
        });
    }
    deleteTag() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = { tagsForDelete: this.selection.selected };
        const dialogRef = this.dialog.open(DeleteResourceTagDialogComponent, config);
        dialogRef.afterClosed().subscribe(success => {
            if (success) {
                this.translator.get('VO_DETAIL.RESOURCES.TAGS.DELETE_SUCCESS').subscribe(text => {
                    this.notificator.showSuccess(text);
                });
                this.updateData();
            }
        });
    }
    create() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = { voId: this.voId };
        const dialogRef = this.dialog.open(CreateResourceTagDialogComponent, config);
        dialogRef.afterClosed().subscribe(success => {
            if (success) {
                this.translator.get('VO_DETAIL.RESOURCES.TAGS.CREATE_SUCCESS').subscribe(text => {
                    this.notificator.showSuccess(text);
                });
                this.updateData();
            }
        });
    }
    updateData() {
        this.loading = true;
        this.selection.clear();
        this.resourceManager.getAllResourcesTagsForVo(this.voId).subscribe(tags => {
            this.resourceTag = tags;
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoResourcesTagsComponent.prototype, "true", void 0);
VoResourcesTagsComponent = __decorate([
    Component({
        selector: 'app-vo-resources-tags',
        templateUrl: './vo-resources-tags.component.html',
        styleUrls: ['./vo-resources-tags.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        ResourcesManagerService,
        MatDialog,
        NotificatorService,
        TableConfigService,
        TranslateService])
], VoResourcesTagsComponent);
export { VoResourcesTagsComponent };
//# sourceMappingURL=vo-resources-tags.component.js.map