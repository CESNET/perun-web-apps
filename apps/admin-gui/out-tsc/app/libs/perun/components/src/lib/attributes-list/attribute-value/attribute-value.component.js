import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AttributeValueMapComponent } from './attribute-value-map/attribute-value-map.component';
let AttributeValueComponent = class AttributeValueComponent {
    constructor() {
        this.readonly = false;
        this.sendEventToParent2 = new EventEmitter();
    }
    ngOnInit() {
    }
    updateMapAttribute() {
        if (this.attribute.type === 'java.util.LinkedHashMap') {
            this.mapComponent.updateAttribute();
        }
    }
    _sendEventToParent2() {
        this.sendEventToParent2.emit();
    }
};
__decorate([
    ViewChild('map'),
    __metadata("design:type", AttributeValueMapComponent)
], AttributeValueComponent.prototype, "mapComponent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueComponent.prototype, "attribute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueComponent.prototype, "readonly", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AttributeValueComponent.prototype, "sendEventToParent2", void 0);
AttributeValueComponent = __decorate([
    Component({
        selector: 'perun-web-apps-attribute-value',
        templateUrl: './attribute-value.component.html',
        styleUrls: ['./attribute-value.component.scss']
    }),
    __metadata("design:paramtypes", [])
], AttributeValueComponent);
export { AttributeValueComponent };
//# sourceMappingURL=attribute-value.component.js.map