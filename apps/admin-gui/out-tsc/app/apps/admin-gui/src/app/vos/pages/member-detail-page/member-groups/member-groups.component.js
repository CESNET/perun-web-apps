import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_MEMBER_DETAIL_GROUPS, TableConfigService } from '@perun-web-apps/config/table-config';
let MemberGroupsComponent = class MemberGroupsComponent {
    constructor(groupsService, tableConfigService, route) {
        this.groupsService = groupsService;
        this.tableConfigService = tableConfigService;
        this.route = route;
        this.tableId = TABLE_MEMBER_DETAIL_GROUPS;
        this.filterValue = '';
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.params.subscribe(parentParams => {
            this.memberId = parentParams['memberId'];
            this.refreshTable();
        });
    }
    refreshTable() {
        this.loading = true;
        this.groupsService.getMemberGroups(this.memberId).subscribe(groups => {
            this.groups = groups;
            this.loading = false;
        }, () => this.loading = false);
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
MemberGroupsComponent.id = 'MemberGroupsComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], MemberGroupsComponent.prototype, "true", void 0);
MemberGroupsComponent = __decorate([
    Component({
        selector: 'app-member-groups',
        templateUrl: './member-groups.component.html',
        styleUrls: ['./member-groups.component.scss']
    }),
    __metadata("design:paramtypes", [GroupsManagerService,
        TableConfigService,
        ActivatedRoute])
], MemberGroupsComponent);
export { MemberGroupsComponent };
//# sourceMappingURL=member-groups.component.js.map