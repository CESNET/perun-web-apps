import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { openClose, rollInOut } from '@perun-web-apps/perun/animations';
import { MatSidenav } from '@angular/material/sidenav';
import { StoreService } from '@perun-web-apps/perun/services';
let SideMenuItemComponent = class SideMenuItemComponent {
    constructor(router, store) {
        this.router = router;
        this.store = store;
        this.expanded = true;
        this.linkBgColor = this.store.get('theme', 'sidemenu_item_links_bg_color');
        this.linkTextColor = this.store.get('theme', 'sidemenu_item_links_text_color');
        this.iconColor = this.store.get('theme', 'sidemenu_item_icon_color');
        this.dividerStyle = '1px solid ' + this.store.get('theme', 'sidemenu_divider_color');
        this.currentUrl = router.url;
        router.events.subscribe((_) => {
            if (_ instanceof NavigationEnd) {
                this.currentUrl = _.url;
            }
        });
    }
    ngOnInit() {
        // this.expanded = this.showOpen;
    }
    ngOnChanges(changes) {
        // this.expanded = this.showOpen;
    }
    toggle() {
        if (this.item.baseLink !== undefined) {
            this.navigate(this.item.baseLink);
            // this.router.navigate(this.item.baseLink);
            // this.closeOnSmallDevice();
        }
        else {
            // this.expanded = !this.expanded;
        }
    }
    isActive(currentUrl, regexValue) {
        const regexp = new RegExp(regexValue);
        return regexp.test(currentUrl);
    }
    navigate(url) {
        if (this.sideNav.mode === 'over') {
            this.sideNav.close().then(() => this.router.navigate(url));
        }
        else {
            this.router.navigate(url);
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], SideMenuItemComponent.prototype, "item", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], SideMenuItemComponent.prototype, "index", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], SideMenuItemComponent.prototype, "showLinks", void 0);
__decorate([
    ViewChild('collapse'),
    __metadata("design:type", ElementRef)
], SideMenuItemComponent.prototype, "collapseDiv", void 0);
__decorate([
    Input(),
    __metadata("design:type", MatSidenav)
], SideMenuItemComponent.prototype, "sideNav", void 0);
SideMenuItemComponent = __decorate([
    Component({
        selector: 'app-side-menu-item',
        templateUrl: './side-menu-item.component.html',
        styleUrls: ['./side-menu-item.component.scss'],
        animations: [
            openClose,
            rollInOut
        ]
    }),
    __metadata("design:paramtypes", [Router,
        StoreService])
], SideMenuItemComponent);
export { SideMenuItemComponent };
//# sourceMappingURL=side-menu-item.component.js.map