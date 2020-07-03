import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
let AttributeValueStringComponent = class AttributeValueStringComponent {
    constructor() {
        this.readonly = false;
        this.sendEventToParent = new EventEmitter();
    }
    ngOnInit() {
        this.value = this.attribute.value;
    }
    _sendEventToParent() {
        this.sendEventToParent.emit();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueStringComponent.prototype, "attribute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueStringComponent.prototype, "readonly", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AttributeValueStringComponent.prototype, "sendEventToParent", void 0);
AttributeValueStringComponent = __decorate([
    Component({
        selector: 'perun-web-apps-attribute-value-string',
        templateUrl: './attribute-value-string.component.html',
        styleUrls: ['./attribute-value-string.component.scss']
    }),
    __metadata("design:paramtypes", [])
], AttributeValueStringComponent);
export { AttributeValueStringComponent };
//# sourceMappingURL=attribute-value-string.component.js.map