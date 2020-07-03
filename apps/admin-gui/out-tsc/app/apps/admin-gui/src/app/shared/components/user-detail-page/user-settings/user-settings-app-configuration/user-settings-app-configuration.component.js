import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
import { GUIConfigService, PREF_PAGE_SIZE } from '@perun-web-apps/config/table-config';
let UserSettingsAppConfigurationComponent = class UserSettingsAppConfigurationComponent {
    constructor(guiConfigService) {
        this.guiConfigService = guiConfigService;
        this.tablePageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    ngOnInit() {
        this.preferredTablePageSize = this.guiConfigService.getNumber(PREF_PAGE_SIZE);
    }
    updatePreferredTablePageSize() {
        this.guiConfigService.setNumber(PREF_PAGE_SIZE, this.preferredTablePageSize);
    }
};
UserSettingsAppConfigurationComponent = __decorate([
    Component({
        selector: 'app-user-settings-app-configuration',
        templateUrl: './user-settings-app-configuration.component.html',
        styleUrls: ['./user-settings-app-configuration.component.scss']
    }),
    __metadata("design:paramtypes", [GUIConfigService])
], UserSettingsAppConfigurationComponent);
export { UserSettingsAppConfigurationComponent };
//# sourceMappingURL=user-settings-app-configuration.component.js.map