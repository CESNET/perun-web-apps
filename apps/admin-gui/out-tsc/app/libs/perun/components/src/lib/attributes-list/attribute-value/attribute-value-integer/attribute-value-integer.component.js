import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
let AttributeValueIntegerComponent = class AttributeValueIntegerComponent {
    constructor() {
        this.readonly = false;
        this.sendEventToParent = new EventEmitter();
    }
    _sendEventToParent() {
        this.sendEventToParent.emit();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueIntegerComponent.prototype, "attribute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueIntegerComponent.prototype, "readonly", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AttributeValueIntegerComponent.prototype, "sendEventToParent", void 0);
AttributeValueIntegerComponent = __decorate([
    Component({
        selector: 'perun-web-apps-attribute-value-integer',
        templateUrl: './attribute-value-integer.component.html',
        styleUrls: ['./attribute-value-integer.component.css']
    }),
    __metadata("design:paramtypes", [])
], AttributeValueIntegerComponent);
export { AttributeValueIntegerComponent };
//# sourceMappingURL=attribute-value-integer.component.js.map