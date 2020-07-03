import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { MembersService, StoreService } from '@perun-web-apps/perun/services';
import { GroupsManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_USER_DETAIL_ADMIN_GROUPS, TABLE_USER_DETAIL_MEMBER_GROUPS, TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
let UserGroupsComponent = class UserGroupsComponent {
    constructor(usersService, memberService, tableConfigService, groupService, store, route) {
        this.usersService = usersService;
        this.memberService = memberService;
        this.tableConfigService = tableConfigService;
        this.groupService = groupService;
        this.store = store;
        this.route = route;
        this.loading = false;
        this.vos = [];
        this.membersGroups = [];
        this.adminsGroups = [];
        this.tableId = TABLE_USER_DETAIL_MEMBER_GROUPS;
        this.adminTableId = TABLE_USER_DETAIL_ADMIN_GROUPS;
    }
    ngOnInit() {
        this.loading = true;
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.adminPageSize = this.tableConfigService.getTablePageSize(this.adminTableId);
        if ((this.showPrincipal = this.route.snapshot.data.showPrincipal) === true) {
            this.userId = this.store.getPerunPrincipal().user.id;
        }
        else {
            this.route.parent.params.subscribe(params => this.userId = params['userId']);
        }
        this.refreshTable();
    }
    refreshTable() {
        this.loading = true;
        this.membersGroups = [];
        this.usersService.getVosWhereUserIsMember(this.userId).subscribe(vos => {
            this.vos = vos;
            for (const vo of this.vos) {
                this.memberService.getMemberByUser(vo.id, this.userId).subscribe(member => {
                    this.groupService.getMemberGroups(member.id).subscribe(groups => {
                        this.membersGroups = this.membersGroups.concat(groups);
                    });
                });
            }
            this.loading = false;
        });
        this.usersService.getGroupsWhereUserIsAdmin(this.userId).subscribe(groups => {
            this.adminsGroups = groups;
        });
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
    adminPageChanged(event) {
        this.adminPageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.adminTableId, event.pageSize);
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], UserGroupsComponent.prototype, "true", void 0);
UserGroupsComponent = __decorate([
    Component({
        selector: 'app-user-groups',
        templateUrl: './user-groups.component.html',
        styleUrls: ['./user-groups.component.scss']
    }),
    __metadata("design:paramtypes", [UsersManagerService,
        MembersService,
        TableConfigService,
        GroupsManagerService,
        StoreService,
        ActivatedRoute])
], UserGroupsComponent);
export { UserGroupsComponent };
//# sourceMappingURL=user-groups.component.js.map