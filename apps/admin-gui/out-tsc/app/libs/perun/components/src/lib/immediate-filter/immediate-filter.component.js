import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
let ImmediateFilterComponent = class ImmediateFilterComponent {
    constructor() {
        this.filter = new EventEmitter();
        this.formControl = new FormControl();
    }
    ngOnInit() {
        this.formControl.valueChanges.subscribe(value => {
            let returnValue = value.trim();
            returnValue = returnValue.toLowerCase();
            this.filter.emit(returnValue);
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], ImmediateFilterComponent.prototype, "placeholder", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], ImmediateFilterComponent.prototype, "filter", void 0);
ImmediateFilterComponent = __decorate([
    Component({
        selector: 'perun-web-apps-immediate-filter',
        templateUrl: './immediate-filter.component.html',
        styleUrls: ['./immediate-filter.component.scss']
    }),
    __metadata("design:paramtypes", [])
], ImmediateFilterComponent);
export { ImmediateFilterComponent };
//# sourceMappingURL=immediate-filter.component.js.map