import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExtSourcesManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AddExtSourceDialogComponent } from '../../../../../shared/components/dialogs/add-ext-source-dialog/add-ext-source-dialog.component';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { TABLE_VO_EXTSOURCES_SETTINGS, TableConfigService } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let VoSettingsExtsourcesComponent = class VoSettingsExtsourcesComponent {
    constructor(extSourceService, route, dialog, notificator, tableConfigService, translate) {
        this.extSourceService = extSourceService;
        this.route = route;
        this.dialog = dialog;
        this.notificator = notificator;
        this.tableConfigService = tableConfigService;
        this.translate = translate;
        this.extSources = [];
        this.selection = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_VO_EXTSOURCES_SETTINGS;
        this.translate.get('VO_DETAIL.SETTINGS.EXT_SOURCES.SUCCESS_REMOVED').subscribe(result => this.successMessage = result);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.parent.params.subscribe(parentParams => {
            this.voId = parentParams['voId'];
            this.refreshTable();
        });
    }
    refreshTable() {
        this.loading = true;
        this.extSourceService.getVoExtSources(this.voId).subscribe(sources => {
            this.extSources = sources;
            this.selection.clear();
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    onAdd() {
        const config = getDefaultDialogConfig();
        config.width = '1000px';
        config.data = {
            voId: this.voId,
            voExtSources: this.extSources,
            theme: 'vo-theme'
        };
        const dialogRef = this.dialog.open(AddExtSourceDialogComponent, config);
        dialogRef.afterClosed().subscribe(added => {
            if (added) {
                this.refreshTable();
            }
        });
    }
    onRemove() {
        for (const extSource of this.selection.selected) {
            this.extSourceService.removeExtSourceWithVoSource(this.voId, extSource.id).subscribe(_ => {
                this.notificator.showSuccess(this.successMessage + extSource.name);
                this.refreshTable();
            });
        }
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
VoSettingsExtsourcesComponent = __decorate([
    Component({
        selector: 'app-vo-settings-extsources',
        templateUrl: './vo-settings-extsources.component.html',
        styleUrls: ['./vo-settings-extsources.component.scss']
    }),
    __metadata("design:paramtypes", [ExtSourcesManagerService,
        ActivatedRoute,
        MatDialog,
        NotificatorService,
        TableConfigService,
        TranslateService])
], VoSettingsExtsourcesComponent);
export { VoSettingsExtsourcesComponent };
//# sourceMappingURL=vo-settings-extsources.component.js.map