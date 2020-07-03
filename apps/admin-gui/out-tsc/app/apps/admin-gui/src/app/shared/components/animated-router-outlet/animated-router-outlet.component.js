import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { fadeIn } from '@perun-web-apps/perun/animations';
let AnimatedRouterOutletComponent = class AnimatedRouterOutletComponent {
    constructor() { }
    ngOnInit() {
    }
    prepareRoute(outlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
};
AnimatedRouterOutletComponent = __decorate([
    Component({
        selector: 'app-animated-router-outlet',
        templateUrl: './animated-router-outlet.component.html',
        styleUrls: ['./animated-router-outlet.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [])
], AnimatedRouterOutletComponent);
export { AnimatedRouterOutletComponent };
//# sourceMappingURL=animated-router-outlet.component.js.map