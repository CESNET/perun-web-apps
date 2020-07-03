import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { parseFullName } from '@perun-web-apps/perun/utils';
import { StoreService } from '@perun-web-apps/perun/services';
let SideMenuItemService = class SideMenuItemService {
    constructor(translate, authResolver, store) {
        this.translate = translate;
        this.authResolver = authResolver;
        this.store = store;
        this.baseItemColor = this.store.get('theme', 'sidemenu_bg_color');
        this.voBgColor = this.store.get('theme', 'sidemenu_vo_bg_color');
        this.memberBgColor = this.store.get('theme', 'sidemenu_member_bg_color');
        this.groupBgColor = this.store.get('theme', 'sidemenu_group_bg_color');
        this.facilityBgColor = this.store.get('theme', 'sidemenu_facility_bg_color');
        this.resourceBgColor = this.store.get('theme', 'sidemenu_resource_bg_color');
        this.userBgColor = this.store.get('theme', 'sidemenu_user_bg_color');
        this.baseItemTextColor = this.store.get('theme', 'sidemenu_text_color');
        this.voTextColor = this.store.get('theme', 'sidemenu_vo_text_color');
        this.memberTextColor = this.store.get('theme', 'sidemenu_member_text_color');
        this.groupTextColor = this.store.get('theme', 'sidemenu_group_text_color');
        this.facilityTextColor = this.store.get('theme', 'sidemenu_facility_text_color');
        this.resourceTextColor = this.store.get('theme', 'sidemenu_resource_text_color');
        this.userTextColor = this.store.get('theme', 'sidemenu_user_text_color');
    }
    getFacilitiesManagementItem() {
        return {
            label: 'MAIN_MENU.FACILITIES',
            colorClass: 'base-item-color-activated',
            icon: 'perun-facility-white',
            baseLink: ['/facilities'],
            links: [],
            baseColorClass: 'base-item-color',
            baseColorClassRegex: '^/facilities$',
            backgroundColorCss: this.baseItemColor,
            textColorCss: this.baseItemTextColor
        };
    }
    getAccessManagementItem() {
        return {
            label: 'MAIN_MENU.ACCESS',
            colorClass: 'base-item-color-activated',
            icon: 'perun-vo',
            links: [],
            baseLink: ['/organizations'],
            baseColorClass: 'base-item-color',
            baseColorClassRegex: '^/organizations$',
            backgroundColorCss: this.baseItemColor,
            textColorCss: this.baseItemTextColor
        };
    }
    getUserItem(user) {
        return {
            baseLink: ['/home'],
            expandable: false,
            label: 'MAIN_MENU.HOME',
            colorClass: 'base-item-color-activated',
            icon: 'perun-home-white',
            baseColorClass: 'base-item-color',
            baseColorClassRegex: '^dont-use$',
            activatedClass: 'dark-item-activated',
            linksClass: 'dark-item-links',
            backgroundColorCss: this.baseItemColor,
            textColorCss: this.baseItemTextColor,
            links: [
                {
                    label: 'MENU_ITEMS.USER.OVERVIEW',
                    url: ['/home'],
                    activatedRegex: '^/home$'
                },
                {
                    label: 'MENU_ITEMS.USER.ORGANIZATIONS',
                    url: [`/home/organizations`],
                    activatedRegex: `^/home/organizations`
                },
                {
                    label: 'MENU_ITEMS.USER.GROUPS',
                    url: [`/home/groups`],
                    activatedRegex: `^/home/groups`
                },
                {
                    label: 'MENU_ITEMS.USER.SETTINGS',
                    url: [`/home/settings`],
                    activatedRegex: `^/home/settings$`,
                    children: [
                        {
                            label: 'MENU_ITEMS.USER.ATTRIBUTES',
                            url: [`/home/settings/attributes`],
                            activatedRegex: `^/home/settings/attributes`
                        },
                        {
                            label: 'MENU_ITEMS.USER.FACILITY_ATTRIBUTES',
                            url: [`/home/settings/facilityAttributes`],
                            activatedRegex: `^/home/settings/facilityAttributes`
                        },
                        {
                            label: 'MENU_ITEMS.USER.ROLES',
                            url: [`/home/settings/roles`],
                            activatedRegex: `^/home/settings/roles`
                        },
                        {
                            label: 'MENU_ITEMS.USER.GUI_CONFIG',
                            url: ['/home/settings/gui-config'],
                            activatedRegex: '/home/settings/gui-config'
                        }
                    ],
                    showChildrenRegex: `^/home/settings`
                },
            ],
        };
    }
    getAdminItem() {
        return {
            baseLink: ['/admin'],
            expandable: false,
            label: 'MAIN_MENU.ADMIN',
            colorClass: 'base-item-color-activated',
            icon: 'perun-perun-admin',
            baseColorClass: 'base-item-color',
            baseColorClassRegex: '^/dont-use$',
            activatedClass: 'dark-item-activated',
            linksClass: 'dark-item-links',
            backgroundColorCss: this.baseItemColor,
            textColorCss: this.baseItemTextColor,
            links: [
                {
                    label: 'MENU_ITEMS.ADMIN.OVERVIEW',
                    url: ['/admin'],
                    activatedRegex: '^/admin$'
                },
                {
                    label: 'MENU_ITEMS.ADMIN.ATTRIBUTES',
                    url: ['/admin/attributes'],
                    activatedRegex: '^/admin/attributes$'
                },
                {
                    label: 'MENU_ITEMS.ADMIN.USERS',
                    url: ['/admin/users'],
                    activatedRegex: '^/admin/users$'
                },
                {
                    label: 'MENU_ITEMS.ADMIN.VISUALIZER',
                    url: ['/admin/visualizer'],
                    activatedRegex: '^/admin/visualizer$',
                    children: [
                        {
                            label: 'MENU_ITEMS.VISUALIZER.ATTR_DEPENDENCIES',
                            url: ['/admin/visualizer/attrDependencies'],
                            activatedRegex: '^/admin/visualizer/attrDependencies'
                        },
                        {
                            label: this.translate.instant('MENU_ITEMS.VISUALIZER.USER_DESTINATION'),
                            url: ['/admin/visualizer/userDestinationRelationship'],
                            activatedRegex: '^/admin/visualizer/userDestinationRelationship'
                        }
                    ],
                    showChildrenRegex: '/admin/visualizer'
                },
                {
                    label: 'MENU_ITEMS.ADMIN.EXT_SOURCES',
                    url: ['/admin/ext_sources'],
                    activatedRegex: '^/admin/ext_sources$'
                }
            ]
        };
    }
    parseFacility(facility) {
        return {
            label: facility.name,
            baseLink: [`/facilities/${facility.id}`],
            backgroundColorCss: this.facilityBgColor,
            textColorCss: this.facilityTextColor,
            links: [
                {
                    label: 'MENU_ITEMS.FACILITY.OVERVIEW',
                    url: [`/facilities/${facility.id}`],
                    activatedRegex: '/facilities/\\d+$'
                },
                {
                    label: 'MENU_ITEMS.FACILITY.RESOURCES',
                    url: [`/facilities/${facility.id}/resources`],
                    activatedRegex: '/facilities/\\d+/resources$'
                },
                {
                    label: 'MENU_ITEMS.FACILITY.ALLOWED_GROUPS',
                    url: [`/facilities/${facility.id}/allowed-groups`],
                    activatedRegex: '/facilities/\\d+/allowed-groups'
                },
                {
                    label: 'MENU_ITEMS.FACILITY.SERVICE_CONFIG',
                    url: [`/facilities/${facility.id}/service-config`],
                    activatedRegex: 'facilities/\\d+/service-config'
                },
                {
                    label: 'MENU_ITEMS.FACILITY.SERVICES_DESTINATIONS',
                    url: [`/facilities/${facility.id}/services-destinations`],
                    activatedRegex: 'facilities/\\d+/services-destinations'
                },
                {
                    label: 'MENU_ITEMS.FACILITY.HOSTS',
                    url: [`/facilities/${facility.id}/hosts`],
                    activatedRegex: 'facilities/\\d+/hosts'
                },
                {
                    label: "MENU_ITEMS.FACILITY.SECURITY_TEAMS",
                    url: [`/facilities/${facility.id}/security-teams`],
                    activatedRegex: 'facilities/\\d+/security-teams'
                },
                {
                    label: 'MENU_ITEMS.FACILITY.SETTINGS',
                    url: ['/facilities', facility.id, 'settings'],
                    activatedRegex: '/facilities/\\d+/settings$',
                    children: [
                        {
                            label: 'MENU_ITEMS.FACILITY.ATTRIBUTES',
                            url: ['/facilities', facility.id, 'settings', 'attributes'],
                            activatedRegex: '/facilities/\\d+/settings/attributes$'
                        },
                        {
                            label: 'MENU_ITEMS.FACILITY.OWNERS',
                            url: ['/facilities', facility.id, 'settings', 'owners'],
                            activatedRegex: '/facilities/\\d+/settings/owners$'
                        },
                        {
                            label: 'MENU_ITEMS.FACILITY.MANAGERS',
                            url: ['/facilities', facility.id, 'settings', 'managers'],
                            activatedRegex: '/facilities/\\d+/settings/managers$'
                        },
                        {
                            label: 'MENU_ITEMS.FACILITY.BLACKLIST',
                            url: ['facilities', facility.id, 'settings', 'blacklist'],
                            activatedRegex: '/facilities/\\d+/settings/blacklist'
                        }
                    ],
                    showChildrenRegex: '/facilities/\\d+/settings'
                }
            ],
            colorClass: 'facility-item',
            icon: 'perun-facility-white',
            // labelClass: 'facility-text',
            activatedClass: 'dark-item-activated',
            linksClass: 'dark-item-links'
        };
    }
    parseResource(resource) {
        return {
            label: resource.name,
            baseLink: ['/facilities', resource.facilityId, 'resources', resource.id],
            backgroundColorCss: this.resourceBgColor,
            textColorCss: this.resourceTextColor,
            links: [
                {
                    label: 'MENU_ITEMS.RESOURCE.OVERVIEW',
                    url: ['/facilities', resource.facilityId, 'resources', resource.id],
                    activatedRegex: '/facilities/\\d+/resources/\\d+$'
                },
                {
                    label: 'MENU_ITEMS.RESOURCE.ASSIGNED_GROUPS',
                    url: [`/facilities/${resource.facilityId}/resources/${resource.id}/groups`],
                    activatedRegex: '/facilities/\\d+/resources/\\d+/groups$'
                },
                {
                    label: 'MENU_ITEMS.RESOURCE.SETTINGS',
                    url: [`/facilities/${resource.facilityId}/resources/${resource.id}/settings`],
                    activatedRegex: '/facilities/\\d+/resources/\\d+/settings$',
                    children: [
                        {
                            label: 'MENU_ITEMS.RESOURCE.ATTRIBUTES',
                            url: [`/facilities/${resource.facilityId}/resources/${resource.id}/settings/attributes`],
                            activatedRegex: '/facilities/\\d+/resources/\\d+/settings/attributes$'
                        }
                    ],
                    showChildrenRegex: '/facilities/\\d+/resources/\\d+/settings'
                }
            ],
            colorClass: 'resource-item',
            icon: 'perun-resource-white',
            // labelClass: 'resource-text',
            activatedClass: 'dark-item-activated',
            linksClass: 'dark-item-links',
        };
    }
    parseGroup(group) {
        return {
            label: group.name,
            baseLink: [`/organizations/${group.voId}/groups/${group.id}`],
            backgroundColorCss: this.groupBgColor,
            textColorCss: this.groupTextColor,
            links: [
                {
                    label: 'MENU_ITEMS.GROUP.OVERVIEW',
                    url: [`/organizations/${group.voId}/groups/${group.id}`],
                    activatedRegex: '/organizations/\\d+/groups/\\d+$'
                },
                {
                    label: 'MENU_ITEMS.GROUP.MEMBERS',
                    url: [`/organizations/${group.voId}/groups/${group.id}/members`],
                    activatedRegex: '/organizations/\\d+/groups/\\d+/members$'
                },
                {
                    label: 'MENU_ITEMS.GROUP.SUBGROUPS',
                    url: [`/organizations/${group.voId}/groups/${group.id}/subgroups`],
                    activatedRegex: '/organizations/\\d+/groups/\\d+/subgroups$'
                },
                {
                    label: 'MENU_ITEMS.GROUP.RESOURCES',
                    url: [`/organizations/${group.voId}/groups/${group.id}/resources`],
                    activatedRegex: '/organizations/\\d+/groups/\\d+/resources$'
                },
                {
                    label: 'MENU_ITEMS.GROUP.APPLICATIONS',
                    url: [`/organizations/${group.voId}/groups/${group.id}/applications`],
                    activatedRegex: '/organizations/\\d+/groups/\\d+/applications$'
                },
                {
                    label: 'MENU_ITEMS.GROUP.SETTINGS',
                    url: [`/organizations/${group.voId}/groups/${group.id}/settings`],
                    activatedRegex: '/organizations/\\d+/groups/\\d+/settings$',
                    children: [
                        {
                            label: 'MENU_ITEMS.GROUP.ATTRIBUTES',
                            url: [`/organizations/${group.voId}/groups/${group.id}/settings/attributes`],
                            activatedRegex: '/organizations/\\d+/groups/\\d+/settings/attributes$'
                        },
                        {
                            label: 'MENU_ITEMS.GROUP.RESOURCE_ATTRIBUTES',
                            url: [`/organizations/${group.voId}/groups/${group.id}/settings/resourceAttributes`],
                            activatedRegex: '/organizations/\\d+/groups/\\d+/settings/resourceAttributes$'
                        },
                        {
                            label: 'MENU_ITEMS.GROUP.EXPIRATION',
                            url: [`/organizations/${group.voId}/groups/${group.id}/settings/expiration`],
                            activatedRegex: '/organizations/\\d+/groups/\\d+/settings/expiration$'
                        },
                        {
                            label: 'MENU_ITEMS.GROUP.MANAGERS',
                            url: [`/organizations/${group.voId}/groups/${group.id}/settings/managers`],
                            activatedRegex: '/organizations/\\d+/groups/\\d+/settings/managers$'
                        },
                        {
                            label: 'MENU_ITEMS.GROUP.APPLICATION_FORM',
                            url: [`/organizations/${group.voId}/groups/${group.id}/settings/applicationForm`],
                            activatedRegex: '/organizations/\\d+/groups/\\d+/settings/applicationForm$'
                        },
                        {
                            label: 'MENU_ITEMS.GROUP.NOTIFICATIONS',
                            url: [`/organizations/${group.voId}/groups/${group.id}/settings/notifications`],
                            activatedRegex: '/organizations/\\d+/groups/\\d+/settings/notifications$'
                        },
                        {
                            label: 'MENU_ITEMS.GROUP.RELATIONS',
                            url: [`/organizations/${group.voId}/groups/${group.id}/settings/relations`],
                            activatedRegex: '/organizations/\\d+/groups/\\d+/settings/relations$'
                        }
                    ],
                    showChildrenRegex: '/organizations/\\d+/groups/\\d+/settings'
                }
            ],
            colorClass: 'group-item',
            icon: 'perun-group',
            // labelClass: 'group-text',
            activatedClass: 'dark-item-activated',
            linksClass: 'dark-item-links'
        };
    }
    parseVo(vo) {
        return {
            label: vo.name,
            baseLink: [`/organizations/${vo.id}`],
            links: this.getVoLinks(vo),
            colorClass: 'vo-item',
            icon: 'perun-vo',
            // labelClass: 'vo-text',
            activatedClass: 'dark-item-activated',
            linksClass: 'dark-item-links',
            backgroundColorCss: this.voBgColor,
            textColorCss: this.voTextColor,
        };
    }
    parseMember(member) {
        return {
            label: parseFullName(member.user),
            baseLink: [`/organizations/${member.voId}/members/${member.id}`],
            backgroundColorCss: this.memberBgColor,
            textColorCss: this.memberTextColor,
            links: [
                {
                    label: 'MENU_ITEMS.MEMBER.OVERVIEW',
                    url: [`/organizations/${member.voId}/members/${member.id}`],
                    activatedRegex: '/organizations/\\d+/members/\\d+$'
                },
                {
                    label: 'MENU_ITEMS.MEMBER.GROUPS',
                    url: [`//organizations/${member.voId}/members/${member.id}/groups`],
                    activatedRegex: '/organizations/\\d+/members/\\d+/groups'
                },
                {
                    label: 'MENU_ITEMS.MEMBER.RESOURCES',
                    url: [`/organizations/${member.voId}/members/${member.id}/resources`],
                    activatedRegex: '/organizations/\\d+/members/\\d+/resources'
                },
                {
                    label: 'MENU_ITEMS.MEMBER.SETTINGS',
                    url: [`/organizations/${member.voId}/members/${member.id}/settings`],
                    activatedRegex: '/organizations/\\d+/members/\\d+/settings$',
                    children: [
                        {
                            label: 'MENU_ITEMS.MEMBER.ATTRIBUTES',
                            url: [`/organizations/${member.voId}/members/${member.id}/settings/attributes`],
                            activatedRegex: '/organizations/\\d+/members/\\d+/settings/attributes$'
                        },
                        {
                            label: 'MENU_ITEMS.MEMBER.RESOURCE_ATTRIBUTES',
                            url: [`/organizations/${member.voId}/members/${member.id}/settings/resourceAttributes`],
                            activatedRegex: '/organizations/\\d+/members/\\d+/settings/resourceAttributes'
                        },
                        {
                            label: 'MENU_ITEMS.MEMBER.GROUP_ATTRIBUTES',
                            url: [`/organizations/${member.voId}/members/${member.id}/settings/groupAttributes`],
                            activatedRegex: '/organizations/\\d+/members/\\d+/settings/groupAttributes$'
                        },
                    ],
                    showChildrenRegex: '/organizations/\\d+/members/\\d+/settings'
                }
            ],
            colorClass: 'member-item',
            icon: 'perun-user',
            // labelClass: 'member-text',
            activatedClass: 'dark-item-activated',
            linksClass: 'dark-item-links'
        };
    }
    parseUser(user, path, regex) {
        return {
            label: parseFullName(user),
            baseLink: [path],
            backgroundColorCss: this.userBgColor,
            textColorCss: this.userTextColor,
            links: [
                {
                    label: 'MENU_ITEMS.USER.OVERVIEW',
                    url: [path],
                    activatedRegex: `${regex}$`
                },
                {
                    label: 'MENU_ITEMS.ADMIN.ORGANIZATIONS',
                    url: [`${path}/organizations`],
                    activatedRegex: `${regex}/organizations`
                },
                {
                    label: 'MENU_ITEMS.ADMIN.GROUPS',
                    url: [`${path}/groups`],
                    activatedRegex: `${regex}/groups`
                },
                {
                    label: 'MENU_ITEMS.USER.IDENTITIES',
                    url: [`${path}/identities`],
                    activatedRegex: `${regex}/identities`
                },
                {
                    label: 'MENU_ITEMS.ADMIN.SETTINGS',
                    url: [`${path}/settings`],
                    activatedRegex: `${regex}/settings$`,
                    children: [
                        {
                            label: 'MENU_ITEMS.MEMBER.ATTRIBUTES',
                            url: [`${path}/settings/attributes`],
                            activatedRegex: `${regex}/settings/attributes`
                        },
                        {
                            label: 'MENU_ITEMS.USER.FACILITY_ATTRIBUTES',
                            url: [`${path}/settings/facilityAttributes`],
                            activatedRegex: `^${path}/settings/facilityAttributes`
                        },
                        {
                            label: 'MENU_ITEMS.USER.ROLES',
                            url: [`${path}/settings/roles`],
                            activatedRegex: `^${path}/settings/roles`
                        },
                        {
                            label: 'MENU_ITEMS.USER.SERVICE_IDENTITIES',
                            url: [`${path}/settings/service-identities`],
                            activatedRegex: `^${path}/settings/service-identities`
                        }
                    ],
                    showChildrenRegex: `${regex}/settings`
                },
            ],
            colorClass: 'user-bg-color',
            icon: 'perun-user',
            activatedClass: 'dark-item-activated',
            linksClass: 'dark-item-links'
        };
    }
    getVoLinks(vo) {
        const links = [];
        // Overview
        links.push({
            label: 'MENU_ITEMS.VO.OVERVIEW',
            url: [`/organizations/${vo.id}`],
            activatedRegex: '/organizations/\\d+$'
        });
        // Members
        if (this.authResolver.isThisVoAdminOrObserver(vo.id)) {
            links.push({
                label: 'MENU_ITEMS.VO.MEMBERS',
                url: [`/organizations/${vo.id}/members`],
                activatedRegex: '/organizations/\\d+/members$'
            });
        }
        // Groups
        if (this.authResolver.isThisVoAdminOrObserver(vo.id)
            || this.authResolver.isGroupAdminInThisVo(vo.id)) {
            links.push({
                label: 'MENU_ITEMS.VO.GROUPS',
                url: [`/organizations/${vo.id}/groups`],
                activatedRegex: '/organizations/\\d+/groups$'
            });
        }
        // Resource management
        if (this.authResolver.isThisVoAdminOrObserver(vo.id)) {
            links.push({
                label: 'MENU_ITEMS.VO.RESOURCES',
                url: [`/organizations/${vo.id}/resources`],
                activatedRegex: '/organizations/\\d+/resources$',
                children: [
                    {
                        label: 'MENU_ITEMS.VO.RESOURCE_PREVIEW',
                        url: [`/organizations/${vo.id}/resources/preview`],
                        activatedRegex: '/organizations/\\d+/resources/preview$'
                    },
                    {
                        label: 'MENU_ITEMS.VO.RESOURCE_TAGS',
                        url: [`/organizations/${vo.id}/resources/tags`],
                        activatedRegex: '/organizations/\\d+/resources/tags$'
                    },
                    {
                        label: 'MENU_ITEMS.VO.RESOURCE_STATES',
                        url: [`/organizations/${vo.id}/resources/states`],
                        activatedRegex: '/organizations/\\d+/resources/states$'
                    }
                ],
                showChildrenRegex: '/organizations/\\d+/resources'
            });
        }
        // Applications
        if (this.authResolver.isThisVoAdminOrObserver(vo.id)) {
            links.push({
                label: 'MENU_ITEMS.VO.APPLICATIONS',
                url: [`/organizations/${vo.id}/applications`],
                activatedRegex: '/organizations/\\d+/applications'
            });
        }
        // Settings
        if (this.authResolver.isThisVoAdminOrObserver(vo.id)) {
            links.push({
                label: 'MENU_ITEMS.VO.SETTINGS',
                url: [`/organizations/${vo.id}/settings`],
                activatedRegex: '/organizations/\\d+/settings$',
                children: [
                    {
                        label: 'MENU_ITEMS.VO.ATTRIBUTES',
                        url: [`/organizations/${vo.id}/settings/attributes`],
                        activatedRegex: '/organizations/\\d+/settings/attributes$'
                    },
                    {
                        label: 'MENU_ITEMS.VO.EXPIRATION',
                        url: [`/organizations/${vo.id}/settings/expiration`],
                        activatedRegex: '/organizations/\\d+/settings/expiration$'
                    },
                    {
                        label: 'MENU_ITEMS.VO.MANAGERS',
                        url: [`/organizations/${vo.id}/settings/managers`],
                        activatedRegex: '/organizations/\\d+/settings/managers$'
                    },
                    {
                        label: 'MENU_ITEMS.VO.APPLICATION_FORM',
                        url: [`/organizations/${vo.id}/settings/applicationForm`],
                        activatedRegex: '/organizations/\\d+/settings/applicationForm$'
                    },
                    {
                        label: 'MENU_ITEMS.VO.NOTIFICATIONS',
                        url: [`/organizations/${vo.id}/settings/notifications`],
                        activatedRegex: '/organizations/\\d+/settings/notifications$'
                    },
                    {
                        label: 'MENU_ITEMS.VO.EXTSOURCES',
                        url: [`/organizations/${vo.id}/settings/extsources`],
                        activatedRegex: '/organizations/\\d+/settings/extsources$'
                    }
                ],
                showChildrenRegex: '/organizations/\\d+/settings'
            });
        }
        return links;
    }
};
SideMenuItemService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [TranslateService,
        GuiAuthResolver,
        StoreService])
], SideMenuItemService);
export { SideMenuItemService };
//# sourceMappingURL=side-menu-item.service.js.map