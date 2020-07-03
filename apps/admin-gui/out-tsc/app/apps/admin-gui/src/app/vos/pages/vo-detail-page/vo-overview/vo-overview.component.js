import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { InviteMemberDialogComponent } from '../../../../shared/components/dialogs/invite-member-dialog/invite-member-dialog.component';
import { SideMenuService } from '../../../../core/services/common/side-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let VoOverviewComponent = class VoOverviewComponent {
    // @HostBinding('class.router-component') true;
    constructor(sideMenuService, voService, route, router, authResolver) {
        this.sideMenuService = sideMenuService;
        this.voService = voService;
        this.route = route;
        this.router = router;
        this.authResolver = authResolver;
        this.items = [];
        this.navItems = [];
    }
    ngOnInit() {
        this.route.parent.params.subscribe(parentParams => {
            const voId = parentParams['voId'];
            this.voService.getVoById(voId).subscribe(vo => {
                this.vo = vo;
                // this.initItems();
                this.initNavItems();
            });
        });
    }
    initNavItems() {
        // Members
        if (this.authResolver.isThisVoAdminOrObserver(this.vo.id)) {
            this.navItems.push({
                cssIcon: 'perun-user',
                url: `/organizations/${this.vo.id}/members`,
                label: 'MENU_ITEMS.VO.MEMBERS',
                style: 'vo-btn'
            });
        }
        // Groups
        if (this.authResolver.isThisVoAdminOrObserver(this.vo.id)
            || this.authResolver.isGroupAdminInThisVo(this.vo.id)) {
            this.navItems.push({
                cssIcon: 'perun-group',
                url: `/organizations/${this.vo.id}/groups`,
                label: 'MENU_ITEMS.VO.GROUPS',
                style: 'vo-btn'
            });
        }
        // Resource management
        if (this.authResolver.isThisVoAdminOrObserver(this.vo.id)) {
            this.navItems.push({
                cssIcon: 'perun-manage-facility',
                url: `/organizations/${this.vo.id}/resources`,
                label: 'MENU_ITEMS.VO.RESOURCES',
                style: 'vo-btn'
            });
        }
        // Applications
        if (this.authResolver.isThisVoAdminOrObserver(this.vo.id)) {
            this.navItems.push({
                cssIcon: 'perun-applications',
                url: `/organizations/${this.vo.id}/applications`,
                label: 'MENU_ITEMS.VO.APPLICATIONS',
                style: 'vo-btn'
            });
        }
        // Settings
        if (this.authResolver.isThisVoAdminOrObserver(this.vo.id)) {
            this.navItems.push({
                cssIcon: 'perun-settings2',
                url: `/organizations/${this.vo.id}/settings`,
                label: 'MENU_ITEMS.VO.SETTINGS',
                style: 'vo-btn'
            });
        }
    }
    initItems() {
        this.items = [
            {
                cssIcon: 'perun-invite-member',
                label: 'VO_DETAIL.OVERVIEW.INVITE_MEMBER',
                style: 'vo-btn',
                url: `/organizations/${this.vo.id}/invite-member`,
                clickAction: function (dialog, voId) {
                    const config = getDefaultDialogConfig();
                    config.width = '450px';
                    config.data = { voId: voId };
                    dialog.open(InviteMemberDialogComponent, config);
                }
            },
            {
                cssIcon: 'perun-service-identity',
                label: 'VO_DETAIL.OVERVIEW.CREATE_SERVICE_MEMBER',
                style: 'vo-btn',
                url: `/organizations/${this.vo.id}/create-service-member`,
                clickAction: function (dialog, voId) {
                    return;
                }
            },
            {
                cssIcon: 'perun-manager',
                label: 'VO_DETAIL.OVERVIEW.ADD_MANAGER',
                style: 'vo-btn',
                url: `/organizations/${this.vo.id}/add-manager`,
                clickAction: function (dialog, voId) {
                    return;
                }
            },
            {
                cssIcon: 'perun-group',
                label: 'VO_DETAIL.OVERVIEW.CREATE_GROUP',
                style: 'vo-btn',
                url: `/organizations/${this.vo.id}/create-group`,
                clickAction: function (dialog, voId) {
                    return;
                }
            },
            {
                cssIcon: 'perun-create1',
                label: 'VO_DETAIL.OVERVIEW.ADD_MEMBER',
                style: 'vo-btn',
                url: `/organizations/${this.vo.id}/invite-member`,
                clickAction: function (dialog, voId) {
                    return;
                }
            }
        ];
    }
};
VoOverviewComponent = __decorate([
    Component({
        selector: 'app-vo-overview',
        templateUrl: './vo-overview.component.html',
        styleUrls: ['./vo-overview.component.scss']
    }),
    __metadata("design:paramtypes", [SideMenuService,
        VosManagerService,
        ActivatedRoute,
        Router,
        GuiAuthResolver])
], VoOverviewComponent);
export { VoOverviewComponent };
//# sourceMappingURL=vo-overview.component.js.map