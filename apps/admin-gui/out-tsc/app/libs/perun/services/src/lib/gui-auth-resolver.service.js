import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Role } from '@perun-web-apps/perun/models';
let GuiAuthResolver = class GuiAuthResolver {
    constructor() {
        this.principalRoles = new Set();
        this.editableFacilities = [];
        this.editableVos = [];
        this.members = [];
        this.editableGroups = [];
        this.observableVos = [];
        this.hasGroupInTheseVos = [];
    }
    init(principal) {
        this.principal = principal;
        this.initData(principal);
    }
    canManageFacilities() {
        return this.hasAtLeasOne(Role.PERUNADMIN, Role.FACILITYADMIN);
    }
    isPerunAdmin() {
        return this.principalRoles.has(Role.PERUNADMIN);
    }
    isVoAdmin() {
        return this.hasAtLeasOne(Role.PERUNADMIN, Role.VOADMIN);
    }
    isThisVoAdminOrObserver(id) {
        return (this.editableVos.includes(id) || this.observableVos.includes(id) || this.principalRoles.has(Role.PERUNADMIN));
    }
    isThisVoAdmin(id) {
        return (this.editableVos.includes(id) || this.principalRoles.has(Role.PERUNADMIN));
    }
    isGroupAdmin() {
        return this.hasAtLeasOne(Role.PERUNADMIN, Role.GROUPADMIN);
    }
    isThisGroupAdmin(id) {
        return (this.editableGroups.includes(id) || this.principalRoles.has(Role.PERUNADMIN));
    }
    isGroupAdminInThisVo(id) {
        return (this.hasGroupInTheseVos.includes(id));
    }
    isFacilityAdmin() {
        return this.hasAtLeasOne(Role.PERUNADMIN, Role.FACILITYADMIN);
    }
    isThisFacilityAdmin(id) {
        return (this.editableFacilities.includes(id) || this.principalRoles.has(Role.PERUNADMIN));
    }
    isVoObserver() {
        return (this.hasAtLeasOne(Role.PERUNADMIN, Role.VOOBSERVER));
    }
    isThisVoObserver(id) {
        return (this.principalRoles.has(Role.PERUNADMIN) || this.observableVos.includes(id));
    }
    getMemberIds() {
        return this.members;
    }
    /**
     * Initialises principal data which are used for later verification
     *
     * @param principal given principal
     */
    initData(principal) {
        this.user = principal.user.id;
        for (const [key, value] of Object.entries(this.principal.roles)) {
            if (principal.roles.hasOwnProperty(key)) {
                this.principalRoles.add(key);
            }
            for (const [keyInner, valueInner] of Object.entries(value)) {
                switch (key) {
                    case Role.VOADMIN: {
                        this.editableVos = valueInner;
                        break;
                    }
                    case Role.FACILITYADMIN: {
                        this.editableFacilities = valueInner;
                        break;
                    }
                    case Role.GROUPADMIN: {
                        if (keyInner === 'Group') {
                            this.editableGroups = valueInner;
                        }
                        if (keyInner === 'Vo') {
                            this.hasGroupInTheseVos = valueInner;
                        }
                        break;
                    }
                    case Role.SELF: {
                        if (keyInner === 'Member') {
                            this.members = valueInner;
                        }
                        break;
                    }
                    case Role.VOOBSERVER: {
                        this.observableVos = valueInner;
                        break;
                    }
                }
            }
        }
    }
    /**
     * Returns true if the principal has at least one of the given roles.
     * Otherwise, returns false
     *
     * @param roles specified roles
     */
    hasAtLeasOne(...roles) {
        for (const role of roles) {
            if (this.principalRoles.has(role)) {
                return true;
            }
        }
        return false;
    }
};
GuiAuthResolver = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [])
], GuiAuthResolver);
export { GuiAuthResolver };
//# sourceMappingURL=gui-auth-resolver.service.js.map