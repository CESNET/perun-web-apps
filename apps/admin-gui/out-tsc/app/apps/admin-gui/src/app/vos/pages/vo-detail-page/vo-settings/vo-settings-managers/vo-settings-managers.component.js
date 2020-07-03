import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
import { Role } from '@perun-web-apps/perun/models';
let VoSettingsManagersComponent = class VoSettingsManagersComponent {
    constructor(dialog, voService, route) {
        this.dialog = dialog;
        this.voService = voService;
        this.route = route;
        this.availableRoles = [Role.VOADMIN, Role.VOOBSERVER, Role.TOPGROUPCREATOR];
        this.selected = 'user';
        this.type = 'Vo';
        this.theme = 'vo-theme';
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(parentParentParams => {
            const voId = parentParentParams['voId'];
            this.voService.getVoById(voId).subscribe(vo => {
                this.vo = vo;
            });
        });
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoSettingsManagersComponent.prototype, "true", void 0);
VoSettingsManagersComponent = __decorate([
    Component({
        selector: 'app-vo-settings-managers',
        templateUrl: './vo-settings-managers.component.html',
        styleUrls: ['./vo-settings-managers.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        VosManagerService,
        ActivatedRoute])
], VoSettingsManagersComponent);
export { VoSettingsManagersComponent };
//# sourceMappingURL=vo-settings-managers.component.js.map