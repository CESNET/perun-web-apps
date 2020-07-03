import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { NavigationStart, Router, RouteReuseStrategy } from '@angular/router';
let CacheHelperService = class CacheHelperService {
    constructor(router, routeReuseStrategy) {
        this.router = router;
        this.routeReuseStrategy = routeReuseStrategy;
        const cache = routeReuseStrategy;
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (event.navigationTrigger === 'popstate') {
                    cache.setLastNavigationType('back');
                }
                else {
                    cache.setLastNavigationType('direct');
                }
            }
        });
    }
    // Do not remove. This method is used to instantiate this service.
    init() {
    }
};
CacheHelperService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [Router,
        RouteReuseStrategy])
], CacheHelperService);
export { CacheHelperService };
//# sourceMappingURL=cache-helper.service.js.map