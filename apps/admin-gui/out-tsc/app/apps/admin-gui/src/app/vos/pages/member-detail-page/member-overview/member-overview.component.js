import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';
import { parseFullName, parseStatusColor, parseStatusIcon } from '@perun-web-apps/perun/utils';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
let MemberOverviewComponent = class MemberOverviewComponent {
    constructor(attributesManager, membersService, translate, route) {
        this.attributesManager = attributesManager;
        this.membersService = membersService;
        this.translate = translate;
        this.route = route;
        this.fullName = '';
        this.statusIcon = '';
        this.statusIconColor = '';
        this.expiration = '';
        this.member = null;
        this.navItems = [];
    }
    ngOnInit() {
        this.route.parent.params.subscribe(parentParams => {
            const memberId = parentParams['memberId'];
            this.membersService.getRichMemberWithAttributes(memberId).subscribe(member => {
                this.member = member;
                this.fullName = parseFullName(this.member.user);
                this.statusIcon = parseStatusIcon(this.member);
                this.statusIconColor = parseStatusColor(this.member);
                this.initNavItems();
                this.attributesManager.getMemberAttributeByName(this.member.id, Urns.MEMBER_DEF_EXPIRATION).subscribe(attr => {
                    this.expiration = attr.value === null ? this.translate.instant('MEMBER_DETAIL.OVERVIEW.NEVER_EXPIRES') : attr.value;
                });
            });
        });
    }
    initNavItems() {
        this.navItems = [
            {
                cssIcon: 'perun-group',
                url: `/organizations/${this.member.voId}/members/${this.member.id}/groups`,
                label: 'MENU_ITEMS.MEMBER.GROUPS',
                style: 'member-btn'
            },
            {
                cssIcon: 'perun-resource',
                url: `/organizations/${this.member.voId}/members/${this.member.id}/resources`,
                label: 'MENU_ITEMS.MEMBER.RESOURCES',
                style: 'member-btn'
            },
            {
                cssIcon: 'perun-settings2',
                url: `/organizations/${this.member.voId}/members/${this.member.id}/settings`,
                label: 'MENU_ITEMS.MEMBER.SETTINGS',
                style: 'member-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], MemberOverviewComponent.prototype, "true", void 0);
MemberOverviewComponent = __decorate([
    Component({
        selector: 'app-member-overview',
        templateUrl: './member-overview.component.html',
        styleUrls: ['./member-overview.component.scss']
    }),
    __metadata("design:paramtypes", [AttributesManagerService,
        MembersService,
        TranslateService,
        ActivatedRoute])
], MemberOverviewComponent);
export { MemberOverviewComponent };
//# sourceMappingURL=member-overview.component.js.map