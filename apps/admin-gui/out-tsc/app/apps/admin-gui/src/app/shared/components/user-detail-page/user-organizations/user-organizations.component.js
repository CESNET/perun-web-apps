import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import { GuiAuthResolver, StoreService } from '@perun-web-apps/perun/services';
import { TABLE_USER_PROFILE_ADMIN_SELECT, TABLE_USER_PROFILE_MEMBER_SELECT, TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
let UserOrganizationsComponent = class UserOrganizationsComponent {
    constructor(usersService, authResolver, tableConfigService, store, route) {
        this.usersService = usersService;
        this.authResolver = authResolver;
        this.tableConfigService = tableConfigService;
        this.store = store;
        this.route = route;
        this.filterValue = '';
        this.displayedColumns = ['id', 'name'];
        this.adminTableId = TABLE_USER_PROFILE_ADMIN_SELECT;
        this.memberTableId = TABLE_USER_PROFILE_MEMBER_SELECT;
    }
    ngOnInit() {
        this.adminPageSize = this.tableConfigService.getTablePageSize(this.adminTableId);
        this.memberPageSize = this.tableConfigService.getTablePageSize(this.memberTableId);
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
        this.usersService.getVosWhereUserIsMember(this.userId).subscribe(vosMember => {
            this.vosWhereIsMember = vosMember;
            this.usersService.getVosWhereUserIsAdmin(this.userId).subscribe(vosAdmin => {
                this.vosWhereIsAdmin = vosAdmin;
                this.loading = false;
            });
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    adminPageChanged(event) {
        this.adminPageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.adminTableId, event.pageSize);
    }
    memberPageChanged(event) {
        this.memberPageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.memberTableId, event.pageSize);
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], UserOrganizationsComponent.prototype, "true", void 0);
UserOrganizationsComponent = __decorate([
    Component({
        selector: 'app-user-organizations',
        templateUrl: './user-organizations.component.html',
        styleUrls: ['./user-organizations.component.scss']
    }),
    __metadata("design:paramtypes", [UsersManagerService,
        GuiAuthResolver,
        TableConfigService,
        StoreService,
        ActivatedRoute])
], UserOrganizationsComponent);
export { UserOrganizationsComponent };
//# sourceMappingURL=user-organizations.component.js.map