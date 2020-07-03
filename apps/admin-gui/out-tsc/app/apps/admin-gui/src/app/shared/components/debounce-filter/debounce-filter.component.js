import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
let DebounceFilterComponent = class DebounceFilterComponent {
    constructor() {
        this.filter = new EventEmitter();
    }
    ngOnInit() {
        fromEvent(this.groupFilterInput.nativeElement, 'keyup').pipe(map((event) => {
            return event.target.value;
        }), debounceTime(500), distinctUntilChanged()).subscribe((text) => {
            this.filter.emit(text);
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], DebounceFilterComponent.prototype, "placeholder", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], DebounceFilterComponent.prototype, "filter", void 0);
__decorate([
    ViewChild('groupFilterInput', { static: true }),
    __metadata("design:type", ElementRef)
], DebounceFilterComponent.prototype, "groupFilterInput", void 0);
DebounceFilterComponent = __decorate([
    Component({
        selector: 'app-debounce-filter',
        templateUrl: './debounce-filter.component.html',
        styleUrls: ['./debounce-filter.component.scss']
    }),
    __metadata("design:paramtypes", [])
], DebounceFilterComponent);
export { DebounceFilterComponent };
//# sourceMappingURL=debounce-filter.component.js.map