import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { openClose } from '@perun-web-apps/perun/animations';
import { ActivatedRoute } from '@angular/router';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { Urns } from '@perun-web-apps/perun/urns';
import { ApiRequestConfigurationService } from '@perun-web-apps/perun/services';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
let VoSettingsExpirationComponent = class VoSettingsExpirationComponent {
    constructor(attributesManager, route, translate, notificator, apiRequest) {
        this.attributesManager = attributesManager;
        this.route = route;
        this.translate = translate;
        this.notificator = notificator;
        this.apiRequest = apiRequest;
        this.translate.get('VO_DETAIL.SETTINGS.EXPIRATION.SUCCESS_MESSAGE').subscribe(value => this.successMessage = value);
        this.translate.get('VO_DETAIL.SETTINGS.EXPIRATION.ERROR_MESSAGE').subscribe(value => this.errorMessage = value);
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(params => {
            this.voId = params['voId'];
            this.loadSettings();
        });
    }
    loadSettings() {
        this.attributesManager.getVoAttributeByName(this.voId, Urns.VO_DEF_EXPIRATION_RULES).subscribe(attr => {
            this.expirationAttribute = attr;
        });
    }
    saveExpirationAttribute(attribute) {
        // FIXME this might not work in case of some race condition (other request finishes sooner)
        this.apiRequest.dontHandleErrorForNext();
        this.attributesManager.setVoAttribute({ vo: this.voId, attribute: attribute }).subscribe(() => {
            this.loadSettings();
            this.notificator.showSuccess(this.successMessage);
        }, error => {
            console.log(error);
            this.notificator.showRPCError(error.error, this.errorMessage);
        });
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoSettingsExpirationComponent.prototype, "true", void 0);
VoSettingsExpirationComponent = __decorate([
    Component({
        selector: 'app-vo-settings-expiration',
        templateUrl: './vo-settings-expiration.component.html',
        styleUrls: ['./vo-settings-expiration.component.scss'],
        animations: [
            openClose
        ]
    }),
    __metadata("design:paramtypes", [AttributesManagerService,
        ActivatedRoute,
        TranslateService,
        NotificatorService,
        ApiRequestConfigurationService])
], VoSettingsExpirationComponent);
export { VoSettingsExpirationComponent };
//# sourceMappingURL=vo-settings-expiration.component.js.map