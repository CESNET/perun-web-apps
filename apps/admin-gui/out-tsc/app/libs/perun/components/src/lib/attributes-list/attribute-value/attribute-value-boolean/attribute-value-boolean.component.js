import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
let AttributeValueBooleanComponent = class AttributeValueBooleanComponent {
    constructor() {
        this.readonly = false;
        this.sendEventToParent = new EventEmitter();
    }
    ngOnInit() {
    }
    _sendEventToParent() {
        this.sendEventToParent.emit();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueBooleanComponent.prototype, "attribute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueBooleanComponent.prototype, "readonly", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AttributeValueBooleanComponent.prototype, "sendEventToParent", void 0);
AttributeValueBooleanComponent = __decorate([
    Component({
        selector: 'perun-web-apps-attribute-value-boolean',
        templateUrl: './attribute-value-boolean.component.html',
        styleUrls: ['./attribute-value-boolean.component.scss']
    }),
    __metadata("design:paramtypes", [])
], AttributeValueBooleanComponent);
export { AttributeValueBooleanComponent };
//# sourceMappingURL=attribute-value-boolean.component.js.map