import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
let VisualizerOverviewComponent = class VisualizerOverviewComponent {
    constructor() {
        this.items = [
            {
                cssIcon: 'perun-module-dependencies',
                url: `attrDependencies`,
                label: 'MENU_ITEMS.VISUALIZER.ATTR_DEPENDENCIES',
                style: 'admin-btn'
            },
            {
                cssIcon: 'perun-user-destination-relationship',
                url: `userDestinationRelationship`,
                label: 'MENU_ITEMS.VISUALIZER.USER_DESTINATION',
                style: 'admin-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VisualizerOverviewComponent.prototype, "true", void 0);
VisualizerOverviewComponent = __decorate([
    Component({
        selector: 'app-visualizer-overview',
        templateUrl: './visualizer-overview.component.html',
        styleUrls: ['./visualizer-overview.component.scss']
    }),
    __metadata("design:paramtypes", [])
], VisualizerOverviewComponent);
export { VisualizerOverviewComponent };
//# sourceMappingURL=visualizer-overview.component.js.map