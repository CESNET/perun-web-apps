import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { AuthService } from './auth.service';
import { StoreService } from './store.service';
import { GuiAuthResolver } from './gui-auth-resolver.service';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { UserDontExistDialogComponent } from '@perun-web-apps/general';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let InitAuthService = class InitAuthService {
    constructor(authService, storeService, authResolver, authzService, dialog) {
        this.authService = authService;
        this.storeService = storeService;
        this.authResolver = authResolver;
        this.authzService = authzService;
        this.dialog = dialog;
    }
    /**
     * Load additional data. First it init authService with necessarily data, then
     * start authentication.
     */
    authenticateUser() {
        this.authService.loadConfigData();
        if (this.storeService.skipOidc()) {
            return new Promise(resolve => resolve(true));
        }
        else {
            return this.authService.authenticate();
        }
    }
    /**
     * Load principal
     */
    loadPrincipal() {
        console.log('Started principal');
        return this.authzService.getPerunPrincipal()
            .toPromise()
            .then(perunPrincipal => {
            if (perunPrincipal.user === null) {
                const config = getDefaultDialogConfig();
                this.dialog.open(UserDontExistDialogComponent, config);
            }
            else {
                this.storeService.setPerunPrincipal(perunPrincipal);
                this.authResolver.init(perunPrincipal);
            }
        });
    }
};
InitAuthService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [AuthService,
        StoreService,
        GuiAuthResolver,
        AuthzResolverService,
        MatDialog])
], InitAuthService);
export { InitAuthService };
//# sourceMappingURL=init-auth.service.js.map