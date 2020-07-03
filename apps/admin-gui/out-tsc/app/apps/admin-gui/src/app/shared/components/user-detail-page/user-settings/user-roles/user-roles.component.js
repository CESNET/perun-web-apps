import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '@perun-web-apps/perun/services';
let UserRolesComponent = class UserRolesComponent {
    constructor(authzResolverService, route, store) {
        this.authzResolverService = authzResolverService;
        this.route = route;
        this.store = store;
        this.currentIds = [];
        this.roles = new Map();
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(params => {
            let userId;
            if (params['userId']) {
                userId = params['userId'];
            }
            else {
                this.principal = this.store.getPerunPrincipal();
                userId = this.principal.userId;
            }
            this.authzResolverService.getUserRoleNames(userId).subscribe(roleNames => {
                this.roleNames = roleNames.map(elem => elem.toUpperCase());
                this.authzResolverService.getUserRoles(userId).subscribe(roles => {
                    this.roleNames.forEach(roleName => {
                        const innerMap = new Map();
                        const innerRoles = Object.keys(roles[roleName]);
                        innerRoles.forEach(innerRole => {
                            innerMap.set(innerRole, roles[roleName][innerRole]);
                        });
                        this.roles.set(roleName, innerMap);
                    });
                });
            });
        });
    }
    getInnerKeys(role) {
        if (this.roles.get(role)) {
            const it = this.roles.get(role).entries();
            const result = [];
            let val = it.next().value;
            while (val) {
                result.push(val);
                val = it.next().value;
            }
            this.currentIds = result;
        }
        else {
            this.currentIds = [];
        }
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], UserRolesComponent.prototype, "true", void 0);
UserRolesComponent = __decorate([
    Component({
        selector: 'app-user-roles',
        templateUrl: './user-roles.component.html',
        styleUrls: ['./user-roles.component.scss']
    }),
    __metadata("design:paramtypes", [AuthzResolverService,
        ActivatedRoute,
        StoreService])
], UserRolesComponent);
export { UserRolesComponent };
//# sourceMappingURL=user-roles.component.js.map