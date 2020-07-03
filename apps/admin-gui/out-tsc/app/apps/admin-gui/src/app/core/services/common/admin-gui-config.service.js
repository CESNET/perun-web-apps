import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { InitAuthService, StoreService } from '@perun-web-apps/perun/services';
import { AppConfigService } from '@perun-web-apps/config';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ServerDownDialogComponent } from '@perun-web-apps/general';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let AdminGuiConfigService = class AdminGuiConfigService {
    constructor(initAuthService, appConfigService, store, authzSevice, dialog, translate) {
        this.initAuthService = initAuthService;
        this.appConfigService = appConfigService;
        this.store = store;
        this.authzSevice = authzSevice;
        this.dialog = dialog;
        this.translate = translate;
        this.entityColorConfigs = [
            {
                entity: 'vo',
                configValue: 'vo_color',
                cssVariable: '--vo-color'
            },
            {
                entity: 'group',
                configValue: 'group_color',
                cssVariable: '--group-color'
            },
            {
                entity: 'user',
                configValue: 'user_color',
                cssVariable: '--user-color'
            },
            {
                entity: 'member',
                configValue: 'member_color',
                cssVariable: '--member-color'
            },
            {
                entity: 'facility',
                configValue: 'facility_color',
                cssVariable: '--facility-color'
            },
            {
                entity: 'resource',
                configValue: 'resource_color',
                cssVariable: '--resource-color'
            },
            {
                entity: 'admin',
                configValue: 'admin_color',
                cssVariable: '--admin-color'
            }
        ];
        this.colorConfigs = [
            {
                configValue: 'sidemenu_hover_color',
                cssVariable: '--side-root-item-hover'
            },
            {
                configValue: 'sidemenu_root_active_color',
                cssVariable: '--side-root-item-active'
            },
            {
                configValue: 'sidemenu-link-active',
                cssVariable: '--side-link-active'
            },
            {
                configValue: 'sidemenu-link-hover',
                cssVariable: '--side-link-hover'
            }
        ];
    }
    loadConfigs() {
        return this.appConfigService.loadAppDefaultConfig()
            .then(() => this.appConfigService.loadAppInstanceConfig())
            .then(() => this.setApiUrl())
            .then(() => this.appConfigService.initializeColors(this.entityColorConfigs, this.colorConfigs))
            .then(() => this.initAuthService.authenticateUser())
            .then(isAuthenticated => {
            // if the user is not authenticated, do not try to load principal
            console.log(isAuthenticated);
            if (isAuthenticated !== true) {
                return new Promise(resolve => resolve());
            }
            return this.initAuthService.loadPrincipal();
        }).catch(err => this.handlePrincipalErr(err));
    }
    /**
     *  We need to set basePath for authzService before loading principal, otherwise authzService uses its default basePath
     */
    setApiUrl() {
        return new Promise((resolve) => {
            this.authzSevice.configuration.basePath = this.store.get('api_url');
            resolve();
        });
    }
    handlePrincipalErr(err) {
        this.translate.get('GENERAL.PRINCIPAL.ERROR.TITLE').subscribe(sdf => console.log(sdf));
        const config = getDefaultDialogConfig();
        config.data = {
            title: this.translate.instant('GENERAL.PRINCIPAL_ERROR.TITLE'),
            message: this.translate.instant('GENERAL.PRINCIPAL_ERROR.MESSAGE'),
            action: this.translate.instant('GENERAL.PRINCIPAL_ERROR.ACTION'),
        };
        this.dialog.open(ServerDownDialogComponent, config);
        throw err;
    }
};
AdminGuiConfigService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [InitAuthService,
        AppConfigService,
        StoreService,
        AuthzResolverService,
        MatDialog,
        TranslateService])
], AdminGuiConfigService);
export { AdminGuiConfigService };
//# sourceMappingURL=admin-gui-config.service.js.map