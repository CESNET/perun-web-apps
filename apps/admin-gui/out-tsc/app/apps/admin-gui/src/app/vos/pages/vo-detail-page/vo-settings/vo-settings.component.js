import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { fadeIn } from '@perun-web-apps/perun/animations';
let VoSettingsComponent = class VoSettingsComponent {
    constructor(route, router) {
        this.route = route;
        this.router = router;
        this.backButtonRegex = new RegExp('/organizations/\\d+/settings/\\w+$');
        this.backButtonDisplayed = false;
        this.currentUrl = router.url;
        this.backButtonDisplayed = this.backButtonRegex.test(this.currentUrl);
        router.events.subscribe((_) => {
            if (_ instanceof NavigationEnd) {
                this.currentUrl = _.url;
                this.backButtonDisplayed = this.backButtonRegex.test(this.currentUrl);
            }
        });
    }
    ngOnInit() {
        this.route.parent.params.subscribe(parentParams => {
            this.voId = parentParams['voId'];
        });
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoSettingsComponent.prototype, "true", void 0);
VoSettingsComponent = __decorate([
    Component({
        selector: 'app-vo-settings',
        templateUrl: './vo-settings.component.html',
        styleUrls: ['./vo-settings.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        Router])
], VoSettingsComponent);
export { VoSettingsComponent };
//# sourceMappingURL=vo-settings.component.js.map