import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
export const PREF_PAGE_SIZE = 'GUI_CONFIG.PREF_PAGE_SIZE';
export const LS_TABLE_PREFIX = "GUI_CONFIG.PREF_PAGE_SIZE.";
let GUIConfigService = class GUIConfigService {
    constructor() { }
    getString(key) {
        return localStorage.getItem(key);
    }
    getNumber(key) {
        return parseInt(localStorage.getItem(key), 10);
    }
    setNumber(key, value) {
        localStorage.setItem(key, value.toString());
    }
};
GUIConfigService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [])
], GUIConfigService);
export { GUIConfigService };
//# sourceMappingURL=guiconfig.service.js.map