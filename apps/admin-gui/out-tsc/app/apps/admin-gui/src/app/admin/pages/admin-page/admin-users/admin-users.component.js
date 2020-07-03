import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ADMIN_USER_SELECT, TableConfigService } from '@perun-web-apps/config/table-config';
import { Urns } from '@perun-web-apps/perun/urns';
import { StoreService } from '@perun-web-apps/perun/services';
let AdminUsersComponent = class AdminUsersComponent {
    constructor(usersService, storeService, tableConfigService) {
        this.usersService = usersService;
        this.storeService = storeService;
        this.tableConfigService = tableConfigService;
        this.searchString = '';
        this.loading = false;
        this.firstSearchDone = false;
        this.tableId = TABLE_ADMIN_USER_SELECT;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    }
    onSearchByString() {
        this.loading = true;
        this.firstSearchDone = true;
        let attributes = [
            Urns.USER_DEF_ORGANIZATION,
            Urns.USER_DEF_PREFERRED_MAIL
        ];
        attributes = attributes.concat(this.storeService.getLoginAttributeNames());
        this.usersService.findRichUsersWithAttributes(this.searchString, attributes).subscribe(users => {
            this.users = users;
            this.loading = false;
        }, () => {
            this.loading = false;
        });
    }
    onKeyInput(event) {
        if (event.key === 'Enter' && this.searchString.length > 0) {
            this.onSearchByString();
        }
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
AdminUsersComponent.id = 'AdminUsersComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], AdminUsersComponent.prototype, "true", void 0);
AdminUsersComponent = __decorate([
    Component({
        selector: 'app-admin-users',
        templateUrl: './admin-users.component.html',
        styleUrls: ['./admin-users.component.scss']
    }),
    __metadata("design:paramtypes", [UsersManagerService,
        StoreService,
        TableConfigService])
], AdminUsersComponent);
export { AdminUsersComponent };
//# sourceMappingURL=admin-users.component.js.map