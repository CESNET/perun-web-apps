import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_FACILITY_ALLOWED_GROUPS, TableConfigService } from '@perun-web-apps/config/table-config';
let FacilityAllowedGroupsComponent = class FacilityAllowedGroupsComponent {
    constructor(facilityManager, route, tableConfigService) {
        this.facilityManager = facilityManager;
        this.route = route;
        this.tableConfigService = tableConfigService;
        this.groups = [];
        this.selected = 'all';
        this.groupsToShow = this.groups;
        this.tableId = TABLE_FACILITY_ALLOWED_GROUPS;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.params.subscribe(parentParams => {
            this.facilityId = parentParams['facilityId'];
            this.facilityManager.getAllowedVos(this.facilityId).subscribe(vos => {
                this.vos = vos;
                this.refreshTable();
            });
        });
    }
    showGroup() {
        if (this.selected !== 'all') {
            this.groupsToShow = this.groups.filter(t => t.voId === parseInt(this.selected, 10));
        }
        else {
            this.groupsToShow = this.groups;
        }
    }
    refreshTable() {
        this.loading = true;
        this.groups = [];
        this.vos.forEach(vo => {
            this.facilityManager.getAllowedGroups(this.facilityId, vo.id).subscribe(group => {
                this.groups = this.groups.concat(group);
                this.groupsToShow = this.groups;
                this.loading = false;
            });
        });
        if (this.vos.length === 0) {
            this.loading = false;
        }
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
FacilityAllowedGroupsComponent.id = 'FacilityAllowedGroupsComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], FacilityAllowedGroupsComponent.prototype, "true", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], FacilityAllowedGroupsComponent.prototype, "groups", void 0);
FacilityAllowedGroupsComponent = __decorate([
    Component({
        selector: 'app-facility-allowed-groups',
        templateUrl: './facility-allowed-groups.component.html',
        styleUrls: ['./facility-allowed-groups.component.scss']
    }),
    __metadata("design:paramtypes", [FacilitiesManagerService,
        ActivatedRoute,
        TableConfigService])
], FacilityAllowedGroupsComponent);
export { FacilityAllowedGroupsComponent };
//# sourceMappingURL=facility-allowed-groups.component.js.map