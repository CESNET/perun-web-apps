import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let ApiRequestConfigurationService = class ApiRequestConfigurationService {
    constructor() {
        this.handleNextError = true;
    }
    dontHandleErrorForNext() {
        this.handleNextError = false;
    }
    shouldHandleError() {
        const value = this.handleNextError;
        this.handleNextError = true;
        return value;
    }
};
ApiRequestConfigurationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ApiRequestConfigurationService);
export { ApiRequestConfigurationService };
//# sourceMappingURL=api-request-configuration.service.js.map