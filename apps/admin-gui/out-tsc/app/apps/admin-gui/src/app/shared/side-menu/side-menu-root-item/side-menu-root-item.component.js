import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { openClose, rollInOut } from '@perun-web-apps/perun/animations';
import { MatSidenav } from '@angular/material/sidenav';
import { StoreService } from '@perun-web-apps/perun/services';
let SideMenuRootItemComponent = class SideMenuRootItemComponent {
    constructor(router, store) {
        this.router = router;
        this.store = store;
        this.expanded = false;
        this.linkBgColor = this.store.get('theme', 'sidemenu_item_links_bg_color');
        this.linkTextColor = this.store.get('theme', 'sidemenu_item_links_text_color');
        this.iconColor = this.store.get('theme', 'sidemenu_item_icon_color');
        this.currentUrl = router.url;
        router.events.subscribe((_) => {
            if (_ instanceof NavigationEnd) {
                this.currentUrl = _.url;
            }
        });
    }
    ngOnInit() {
        this.expanded = this.showOpen;
    }
    ngOnChanges(changes) {
        this.expanded = this.showOpen;
    }
    toggle() {
        if (this.item.baseLink !== undefined) {
            this.navigate(this.item.baseLink);
        }
        else {
            this.expanded = !this.expanded;
        }
    }
    isActive(currentUrl, regexValue) {
        const regexp = new RegExp(regexValue);
        return regexp.test(currentUrl);
    }
    getBgClass() {
        if (this.item.baseColorClass) {
            return this.isActive(this.currentUrl, this.item.baseColorClassRegex) ? this.item.colorClass : this.item.baseColorClass;
        }
        else {
            return this.item.colorClass;
        }
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
], SideMenuRootItemComponent.prototype, "item", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], SideMenuRootItemComponent.prototype, "index", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], SideMenuRootItemComponent.prototype, "showOpen", void 0);
__decorate([
    ViewChild('collapse'),
    __metadata("design:type", ElementRef)
], SideMenuRootItemComponent.prototype, "collapseDiv", void 0);
__decorate([
    Input(),
    __metadata("design:type", MatSidenav)
], SideMenuRootItemComponent.prototype, "sideNav", void 0);
SideMenuRootItemComponent = __decorate([
    Component({
        selector: 'app-side-menu-root-item',
        templateUrl: './side-menu-root-item.component.html',
        styleUrls: ['./side-menu-root-item.component.scss'],
        animations: [
            openClose,
            rollInOut
        ]
    }),
    __metadata("design:paramtypes", [Router,
        StoreService])
], SideMenuRootItemComponent);
export { SideMenuRootItemComponent };
//# sourceMappingURL=side-menu-root-item.component.js.map