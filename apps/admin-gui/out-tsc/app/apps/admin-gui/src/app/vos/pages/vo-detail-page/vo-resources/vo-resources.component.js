import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeIn } from '@perun-web-apps/perun/animations';
let VoResourcesComponent = class VoResourcesComponent {
    constructor(route) {
        this.route = route;
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
], VoResourcesComponent.prototype, "true", void 0);
VoResourcesComponent = __decorate([
    Component({
        selector: 'app-vo-resources',
        templateUrl: './vo-resources.component.html',
        styleUrls: ['./vo-resources.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [ActivatedRoute])
], VoResourcesComponent);
export { VoResourcesComponent };
//# sourceMappingURL=vo-resources.component.js.map