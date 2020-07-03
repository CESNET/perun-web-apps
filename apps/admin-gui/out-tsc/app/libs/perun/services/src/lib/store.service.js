import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
/**
 * Class that just store data about instance and default configuration.
 * No logic involved.
 */
let StoreService = class StoreService {
    constructor() { }
    setInstanceConfig(instanceConfig) {
        this.instanceConfig = instanceConfig;
    }
    setDefaultConfig(defaultConfig) {
        this.defaultConfig = defaultConfig;
    }
    setPerunPrincipal(principal) {
        this.principal = principal;
    }
    getPerunPrincipal() {
        return this.principal;
    }
    getLoginAttributeNames() {
        return this.get("login_namespace_attributes");
    }
    skipOidc() {
        return this.get('skip_oidc');
    }
    /**
     * Get key from json configuration. If key is not present in instance
     * configuration method returns value from default configuration.
     * @param keys
     */
    get(...keys) {
        let currentValue;
        if (this.instanceConfig !== undefined) {
            for (let i = 0; i < keys.length; ++i) {
                if (i === 0) {
                    currentValue = this.instanceConfig[keys[i]];
                }
                else {
                    if (currentValue === undefined) {
                        break;
                    }
                    currentValue = currentValue[keys[i]];
                }
            }
        }
        if (this.defaultConfig === undefined) {
            return undefined;
        }
        if (currentValue === undefined) {
            for (let i = 0; i < keys.length; ++i) {
                if (i === 0) {
                    currentValue = this.defaultConfig[keys[i]];
                }
                else {
                    if (currentValue === undefined) {
                        console.error('Missing value in default config: ' + keys);
                        break;
                    }
                    currentValue = currentValue[keys[i]];
                }
            }
        }
        return currentValue;
    }
};
StoreService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [])
], StoreService);
export { StoreService };
//# sourceMappingURL=store.service.js.map