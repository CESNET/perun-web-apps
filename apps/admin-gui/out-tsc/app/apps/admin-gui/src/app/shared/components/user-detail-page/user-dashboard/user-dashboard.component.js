import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { FacilitiesManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { GuiAuthResolver, StoreService } from '@perun-web-apps/perun/services';
import { TABLE_USER_PROFILE_DASHBOARD_FACILITY, TABLE_USER_PROFILE_DASHBOARD_GROUP, TABLE_USER_PROFILE_DASHBOARD_VO, TableConfigService } from '@perun-web-apps/config/table-config';
let UserDashboardComponent = class UserDashboardComponent {
    constructor(userManager, storeService, guiAuthResolver, tableConfigService, facilitiesService) {
        this.userManager = userManager;
        this.storeService = storeService;
        this.guiAuthResolver = guiAuthResolver;
        this.tableConfigService = tableConfigService;
        this.facilitiesService = facilitiesService;
        this.navItems = [];
        this.adminVo = [];
        this.voTableId = TABLE_USER_PROFILE_DASHBOARD_VO;
        this.voFilterValue = '';
        this.adminGroup = [];
        this.groupTableId = TABLE_USER_PROFILE_DASHBOARD_GROUP;
        this.groupFilterValue = '';
        this.adminFacility = [];
        this.facilityTableId = TABLE_USER_PROFILE_DASHBOARD_FACILITY;
        this.facilityFilterValue = '';
    }
    ngOnInit() {
        this.user = this.storeService.getPerunPrincipal().user;
        this.voPageSize = this.tableConfigService.getTablePageSize(this.voTableId);
        this.groupPageSize = this.tableConfigService.getTablePageSize(this.groupTableId);
        this.facilityPageSize = this.tableConfigService.getTablePageSize(this.facilityTableId);
        this.getAdminVoGroup();
    }
    getAdminVoGroup() {
        this.userManager.getVosWhereUserIsAdmin(this.user.id).subscribe(vo => {
            this.adminVo = vo;
            this.userManager.getGroupsWhereUserIsAdmin(this.user.id).subscribe(groups => {
                this.adminGroup = groups;
                this.getAdminFacility();
            });
        });
    }
    getAdminFacility() {
        if (this.guiAuthResolver.isFacilityAdmin()) {
            this.facilitiesService.getAllFacilities().subscribe(facilities => {
                this.adminFacility = facilities;
            });
        }
    }
    pageChanged($event, tableId, pagesize) {
        pagesize = $event.pageSize;
        this.tableConfigService.setTablePageSize(tableId, pagesize);
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], UserDashboardComponent.prototype, "true", void 0);
UserDashboardComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-user-dashboard',
        templateUrl: './user-dashboard.component.html',
        styleUrls: ['./user-dashboard.component.scss']
    }),
    __metadata("design:paramtypes", [UsersManagerService,
        StoreService,
        GuiAuthResolver,
        TableConfigService,
        FacilitiesManagerService])
], UserDashboardComponent);
export { UserDashboardComponent };
//# sourceMappingURL=user-dashboard.component.js.map