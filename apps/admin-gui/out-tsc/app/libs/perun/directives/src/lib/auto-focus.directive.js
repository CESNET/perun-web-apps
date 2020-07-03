import { __decorate, __metadata } from "tslib";
import { Directive, ElementRef } from '@angular/core';
let AutoFocusDirective = class AutoFocusDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    ngOnInit() {
        this.elementRef.nativeElement.focus();
    }
};
AutoFocusDirective = __decorate([
    Directive({
        selector: '[perunWebAppsAutoFocus]'
    }),
    __metadata("design:paramtypes", [ElementRef])
], AutoFocusDirective);
export { AutoFocusDirective };
//# sourceMappingURL=auto-focus.directive.js.map