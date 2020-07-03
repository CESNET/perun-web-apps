import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@perun-web-apps/perun/services';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
let CoreModule = class CoreModule {
};
CoreModule = __decorate([
    NgModule({
        imports: [
            CommonModule
        ],
        providers: [
            AuthService
        ],
        exports: [
            AuthCallbackComponent,
        ],
        declarations: [AuthCallbackComponent],
    })
], CoreModule);
export { CoreModule };
//# sourceMappingURL=core.module.js.map