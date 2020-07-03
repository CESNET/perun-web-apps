import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { StoreService } from '@perun-web-apps/perun/services';
let DebuggerPageComponent = class DebuggerPageComponent {
    constructor(authResolver, store) {
        this.authResolver = authResolver;
        this.store = store;
    }
    ngOnInit() {
        this.principal = this.store.getPerunPrincipal();
    }
};
DebuggerPageComponent = __decorate([
    Component({
        selector: 'app-debugger-page',
        templateUrl: './debugger-page.component.html',
        styleUrls: ['./debugger-page.component.scss']
    }),
    __metadata("design:paramtypes", [GuiAuthResolver,
        StoreService])
], DebuggerPageComponent);
export { DebuggerPageComponent };
//# sourceMappingURL=debugger-page.component.js.map