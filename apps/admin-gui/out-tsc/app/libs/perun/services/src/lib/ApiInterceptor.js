import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { StoreService } from './store.service';
import { NotificatorService } from './notificator.service';
import { ApiRequestConfigurationService } from './api-request-configuration.service';
let ApiInterceptor = class ApiInterceptor {
    constructor(authService, apiRequestConfiguration, notificator, store) {
        this.authService = authService;
        this.apiRequestConfiguration = apiRequestConfiguration;
        this.notificator = notificator;
        this.store = store;
    }
    intercept(req, next) {
        const apiUrl = this.store.get('api_url');
        // check if the request is trying to access localization file, if so
        // disable cache
        if (req.url.indexOf("i18n") !== -1) {
            req = req.clone({
                setHeaders: {
                    'Cache-control': 'no-cache, must-revalidate'
                }
            });
        }
        if (apiUrl !== undefined && req.url.toString().indexOf(apiUrl) !== -1 && !this.store.skipOidc() && !this.authService.isLoggedIn()) {
            const err = {
                message: "Your authentication has timed out.",
                errorId: null,
                name: "User not logged in.",
                type: "UserNotLoggedIn"
            };
            this.notificator.showRPCError(err);
            return throwError(err);
        }
        // Apply the headers
        req = req.clone({
            setHeaders: {
                'Authorization': this.authService.getAuthorizationHeaderValue()
            }
        });
        // Also handle errors globally
        return next.handle(req).pipe(tap(x => x, err => {
            // Handle this err
            const errRpc = this.formatErrors(err, req);
            if (errRpc === undefined) {
                return throwError(err);
            }
            if (this.apiRequestConfiguration.shouldHandleError()) {
                this.notificator.showRPCError(errRpc);
            }
            else {
                return throwError(errRpc);
            }
        }));
    }
    formatErrors(error, req) {
        let rpcError;
        if (error.error.errorId) {
            rpcError = error.error;
        }
        else {
            rpcError = JSON.parse(error.error);
        }
        if (rpcError === undefined) {
            return undefined;
        }
        rpcError.call = req.url;
        rpcError.payload = req.body;
        return rpcError;
    }
};
ApiInterceptor = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthService,
        ApiRequestConfigurationService,
        NotificatorService,
        StoreService])
], ApiInterceptor);
export { ApiInterceptor };
//# sourceMappingURL=ApiInterceptor.js.map