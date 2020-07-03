import { __decorate, __metadata } from "tslib";
import { EventEmitter, Injectable, Output } from '@angular/core';
let SideMenuService = class SideMenuService {
    constructor() {
        this.accessItemsChange = new EventEmitter();
        this.facilityItemsChange = new EventEmitter();
        this.adminItemsChange = new EventEmitter();
        this.userItemsChange = new EventEmitter();
        this.resetChange = new EventEmitter();
    }
    setAccessMenuItems(items) {
        this.accessItemsChange.emit(items);
    }
    setFacilityMenuItems(items) {
        this.facilityItemsChange.emit(items);
    }
    setAdminItems(items) {
        this.adminItemsChange.emit(items);
    }
    setUserItems(items) {
        this.userItemsChange.emit(items);
    }
    reset() {
        this.resetChange.emit();
    }
};
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], SideMenuService.prototype, "accessItemsChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], SideMenuService.prototype, "facilityItemsChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], SideMenuService.prototype, "adminItemsChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], SideMenuService.prototype, "userItemsChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], SideMenuService.prototype, "resetChange", void 0);
SideMenuService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [])
], SideMenuService);
export { SideMenuService };
//# sourceMappingURL=side-menu.service.js.map