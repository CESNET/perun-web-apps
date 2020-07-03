import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SideMenuService } from '../../core/services/common/side-menu.service';
import { AppComponent } from '../../app.component';
import { SideMenuItemService } from './side-menu-item.service';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { rollInOut } from '@perun-web-apps/perun/animations';
import { StoreService } from '@perun-web-apps/perun/services';
let SideMenuComponent = class SideMenuComponent {
    constructor(sideMenuService, sideMenuItemService, authResolver, store) {
        this.sideMenuService = sideMenuService;
        this.sideMenuItemService = sideMenuItemService;
        this.authResolver = authResolver;
        this.store = store;
        this.accessItems = [];
        this.facilityItems = [];
        this.adminItems = [];
        this.userItems = [];
        this.accessItem = this.sideMenuItemService.getAccessManagementItem();
        this.adminItem = this.sideMenuItemService.getAdminItem();
        this.facilityItem = this.sideMenuItemService.getFacilitiesManagementItem();
        this.userItem = this.sideMenuItemService.getUserItem(this.store.getPerunPrincipal().user);
        this.mobileView = true;
        this.adminItemOpened = false;
        this.userItemOpened = false;
    }
    ngOnInit() {
        this.mobileView = window.innerWidth <= AppComponent.minWidth;
        if (this.mobileView) {
            this.sideNav.close();
        }
        else {
            this.sideNav.open();
        }
        this.sideMenuService.facilityItemsChange.subscribe(items => {
            this.setFacilityItems(items);
        });
        this.sideMenuService.accessItemsChange.subscribe(items => {
            this.setAccessItems(items);
        });
        this.sideMenuService.adminItemsChange.subscribe(items => {
            this.setAdminItems(items);
        });
        this.sideMenuService.userItemsChange.subscribe(items => {
            this.setUserItems(items);
        });
        this.sideMenuService.resetChange.subscribe(() => {
            this.reset();
        });
    }
    reset() {
        this.adminItemOpened = false;
        this.userItemOpened = false;
        this.setNewItems(this.userItems, []);
        this.setNewItems(this.adminItems, []);
        this.setNewItems(this.accessItems, []);
        this.setNewItems(this.facilityItems, []);
    }
    resetExceptFacility() {
        this.adminItemOpened = false;
        this.userItemOpened = false;
        this.setNewItems(this.userItems, []);
        this.setNewItems(this.adminItems, []);
        this.setNewItems(this.accessItems, []);
    }
    resetExceptAccess() {
        this.adminItemOpened = false;
        this.userItemOpened = false;
        this.setNewItems(this.userItems, []);
        this.setNewItems(this.adminItems, []);
        this.setNewItems(this.facilityItems, []);
    }
    resetExceptAdmin() {
        this.userItemOpened = false;
        this.setNewItems(this.userItems, []);
        this.setNewItems(this.accessItems, []);
        this.setNewItems(this.facilityItems, []);
    }
    resetExceptUser() {
        this.adminItemOpened = false;
        this.setNewItems(this.accessItems, []);
        this.setNewItems(this.facilityItems, []);
        this.setNewItems(this.adminItems, []);
    }
    setFacilityItems(items) {
        this.resetExceptFacility();
        this.setNewItems(this.facilityItems, items);
    }
    setAccessItems(items) {
        this.resetExceptAccess();
        this.setNewItems(this.accessItems, items);
    }
    setUserItems(items) {
        this.userItemOpened = true;
        this.resetExceptUser();
        this.setNewItems(this.userItems, items);
    }
    setAdminItems(items) {
        this.adminItemOpened = true;
        this.resetExceptAdmin();
        this.setNewItems(this.adminItems, items);
    }
    /**
     * This method is used to set new sideMenuItems to an existing array of items.
     *
     * The method replaces only items that were not int the origin array.
     * If the new array has smaller size, excessive items are removed from the origin array.
     * This method is used because of animations. Without this, they do not work properly.
     *
     * @param originItems origin array
     * @param newItems new items
     */
    setNewItems(originItems, newItems) {
        const maxLength = originItems.length > newItems.length ? originItems.length : newItems.length;
        for (let i = 0; i < maxLength; i++) {
            if (i > originItems.length - 1) {
                originItems.push(newItems[i]);
            }
            else if (i > newItems.length - 1) {
                const originItemsLength = originItems.length;
                for (let j = 0; j < originItemsLength - i; j++) {
                    originItems.pop();
                }
                break;
            }
            else if (!this.areSameItems(originItems[i], newItems[i])) {
                originItems[i] = newItems[i];
            }
            // items are same, dont switch
        }
    }
    areSameItems(item1, item2) {
        return item1.label === item2.label && item1.labelClass === item2.labelClass;
    }
};
__decorate([
    Input(),
    __metadata("design:type", MatSidenav)
], SideMenuComponent.prototype, "sideNav", void 0);
SideMenuComponent = __decorate([
    Component({
        selector: 'app-side-menu',
        templateUrl: './side-menu.component.html',
        styleUrls: ['./side-menu.component.scss'],
        animations: [
            rollInOut
        ]
    }),
    __metadata("design:paramtypes", [SideMenuService,
        SideMenuItemService,
        GuiAuthResolver,
        StoreService])
], SideMenuComponent);
export { SideMenuComponent };
//# sourceMappingURL=side-menu.component.js.map