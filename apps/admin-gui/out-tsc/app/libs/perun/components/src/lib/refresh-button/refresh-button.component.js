import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
let RefreshButtonComponent = class RefreshButtonComponent {
    constructor() {
        this.refresh = new EventEmitter();
    }
    onClickbutton(event) {
        this.refresh.emit(event);
    }
};
__decorate([
    Output(),
    __metadata("design:type", Object)
], RefreshButtonComponent.prototype, "refresh", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], RefreshButtonComponent.prototype, "disabled", void 0);
RefreshButtonComponent = __decorate([
    Component({
        selector: 'perun-web-apps-refresh-button',
        templateUrl: './refresh-button.component.html',
        styleUrls: ['./refresh-button.component.scss']
    }),
    __metadata("design:paramtypes", [])
], RefreshButtonComponent);
export { RefreshButtonComponent };
//# sourceMappingURL=refresh-button.component.js.map