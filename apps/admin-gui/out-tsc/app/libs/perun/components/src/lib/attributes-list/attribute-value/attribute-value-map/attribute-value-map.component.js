import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
let AttributeValueMapComponent = class AttributeValueMapComponent {
    constructor() {
        this.readonly = false;
        this.keys = [];
        this.values = [];
    }
    ngOnInit() {
        if (this.attribute.value !== undefined) {
            const map = this.attribute.value;
            for (const [key, value] of Object.entries(map)) {
                this.keys.push(key);
                this.values.push(value);
            }
        }
    }
    customTrackBy(index, obj) {
        return index;
    }
    addValue() {
        this.keys.push('');
        this.values.push('');
    }
    removeValue(index) {
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
    }
    updateAttribute() {
        const map = {};
        for (let i = 0; i < this.keys.length; i++) {
            map[this.keys[i]] = this.values[i];
        }
        if (this.keys.length === 0) {
            this.attribute.value = undefined;
        }
        else {
            this.attribute.value = map;
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueMapComponent.prototype, "attribute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeValueMapComponent.prototype, "readonly", void 0);
AttributeValueMapComponent = __decorate([
    Component({
        selector: 'perun-web-apps-attribute-value-map',
        templateUrl: './attribute-value-map.component.html',
        styleUrls: ['./attribute-value-map.component.scss']
    }),
    __metadata("design:paramtypes", [])
], AttributeValueMapComponent);
export { AttributeValueMapComponent };
//# sourceMappingURL=attribute-value-map.component.js.map