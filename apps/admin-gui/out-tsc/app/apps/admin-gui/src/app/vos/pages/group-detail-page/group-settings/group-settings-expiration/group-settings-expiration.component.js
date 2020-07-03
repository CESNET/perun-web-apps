import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';
import { ApiRequestConfigurationService } from '@perun-web-apps/perun/services';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
let GroupSettingsExpirationComponent = class GroupSettingsExpirationComponent {
    constructor(attributesManager, route, translate, notificator, apiRequest) {
        this.attributesManager = attributesManager;
        this.route = route;
        this.translate = translate;
        this.notificator = notificator;
        this.apiRequest = apiRequest;
        this.translate.get('GROUP_DETAIL.SETTINGS.EXPIRATION.SUCCESS_MESSAGE').subscribe(value => this.successMessage = value);
        this.translate.get('GROUP_DETAIL.SETTINGS.EXPIRATION.ERROR_MESSAGE').subscribe(value => this.errorMessage = value);
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(params => {
            this.groupId = params['groupId'];
            this.loadSettings();
        });
    }
    loadSettings() {
        this.attributesManager.getGroupAttributeByName(this.groupId, Urns.GROUP_DEF_EXPIRATION_RULES).subscribe(attr => {
            this.expirationAttribute = attr;
        });
    }
    saveExpirationAttribute(attribute) {
        // FIXME this might not work in case of some race condition (other request finishes sooner)
        this.apiRequest.dontHandleErrorForNext();
        this.attributesManager.setGroupAttribute({ group: this.groupId, attribute: attribute }).subscribe(() => {
            this.loadSettings();
            this.notificator.showSuccess(this.successMessage);
        }, error => this.notificator.showRPCError(error.error, this.errorMessage));
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupSettingsExpirationComponent.prototype, "true", void 0);
GroupSettingsExpirationComponent = __decorate([
    Component({
        selector: 'app-group-settings-expiration',
        templateUrl: './group-settings-expiration.component.html',
        styleUrls: ['./group-settings-expiration.component.scss']
    }),
    __metadata("design:paramtypes", [AttributesManagerService,
        ActivatedRoute,
        TranslateService,
        NotificatorService,
        ApiRequestConfigurationService])
], GroupSettingsExpirationComponent);
export { GroupSettingsExpirationComponent };
//# sourceMappingURL=group-settings-expiration.component.js.map