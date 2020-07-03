var AppComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, HostListener } from '@angular/core';
import { CacheHelperService } from './core/services/common/cache-helper.service';
import { StoreService } from '@perun-web-apps/perun/services';
import { environment } from '../environments/environment';
let AppComponent = AppComponent_1 = class AppComponent {
    constructor(cache, store) {
        this.cache = cache;
        this.store = store;
        this.sidebarMode = 'side';
        this.isProduction = false;
        this.navBackgroundColor = this.store.get('theme', 'nav_bg_color');
        this.sideBarBorderColor = this.store.get('theme', 'sidemenu_border_color');
        this.contentBackgroundColor = this.store.get('theme', 'content_bg_color');
        this.sideMenubackgroundColor = this.store.get('theme', 'sidemenu_bg_color');
        this.cache.init();
        this.getScreenSize(null);
    }
    getScreenSize(event) {
        this.sidebarMode = this.isMobile() ? 'over' : 'side';
        this.lastScreenWidth = window.innerWidth;
    }
    isMobile() {
        return window.innerWidth <= AppComponent_1.minWidth;
    }
    ngOnInit() {
        this.isProduction = environment.production;
        this.principal = this.store.getPerunPrincipal();
    }
    getTopGap() {
        return environment.production ? 112 : 64;
    }
    getSideNavMarginTop() {
        return environment.production ? '112px' : '64px';
    }
    getSideNavMinHeight() {
        return environment.production ? 'calc(100vh - 112px)' : 'calc(100vh - 64px)';
    }
    getNavMenuTop() {
        return environment.production ? '48px' : '0';
    }
    getContentInnerMinHeight() {
        // 64 for nav (+48) when alert is shown
        // 210 for footer, 510 for footer on mobile
        let footerSpace = this.isMobile() ? '510' : '210';
        footerSpace = '0';
        return environment.production ? 'calc((100vh - 112px) + ' + footerSpace + 'px)' : 'calc((100vh - 64px) + ' + footerSpace + 'px)';
    }
};
AppComponent.minWidth = 992;
__decorate([
    HostListener('window:resize', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "getScreenSize", null);
AppComponent = AppComponent_1 = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    }),
    __metadata("design:paramtypes", [CacheHelperService,
        StoreService])
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map