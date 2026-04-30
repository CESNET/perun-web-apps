import { Routes } from '@angular/router';
import { VoSelectPageComponent } from './pages/vo-select-page/vo-select-page.component';
import { GroupDetailPageComponent } from './pages/group-detail-page/group-detail-page.component';
import { MemberDetailPageComponent } from './pages/member-detail-page/member-detail-page.component';
import { VoOverviewComponent } from './pages/vo-detail-page/vo-overview/vo-overview.component';
import { VoGroupsComponent } from './pages/vo-detail-page/vo-groups/vo-groups.component';
import { VoMembersComponent } from './pages/vo-detail-page/vo-members/vo-members.component';
import { VoDetailPageComponent } from './pages/vo-detail-page/vo-detail-page.component';
import { MemberOverviewComponent } from './pages/member-detail-page/member-overview/member-overview.component';
import { MemberGroupsComponent } from './pages/member-detail-page/member-groups/member-groups.component';
import { GroupOverviewComponent } from './pages/group-detail-page/group-overview/group-overview.component';
import { GroupSubgroupsComponent } from './pages/group-detail-page/group-subgroups/group-subgroups.component';
import { VoResourcesComponent } from './pages/vo-detail-page/vo-resources/vo-resources.component';
import { VoSettingsComponent } from './pages/vo-detail-page/vo-settings/vo-settings.component';
import { VoAttributesComponent } from './pages/vo-detail-page/vo-attributes/vo-attributes.component';
import { VoSettingsOverviewComponent } from './pages/vo-detail-page/vo-settings/vo-settings-overview/vo-settings-overview.component';
import { VoSettingsExpirationComponent } from './pages/vo-detail-page/vo-settings/vo-settings-expiration/vo-settings-expiration.component';
import { VoSettingsManagersComponent } from './pages/vo-detail-page/vo-settings/vo-settings-managers/vo-settings-managers.component';
import { GroupMembersComponent } from './pages/group-detail-page/group-members/group-members.component';
import { GroupResourcesComponent } from './pages/group-detail-page/group-resources/group-resources.component';
import { GroupSettingsComponent } from './pages/group-detail-page/group-settings/group-settings.component';
import { GroupAttributesComponent } from './pages/group-detail-page/group-attributes/group-attributes.component';
import { GroupSettingsOverviewComponent } from './pages/group-detail-page/group-settings/group-settings-overview/group-settings-overview.component';
// eslint-disable-next-line max-len
import { MemberAttributesComponent } from './pages/member-detail-page/member-attributes/member-attributes.component';
import { VoResourcesOverviewComponent } from './pages/vo-detail-page/vo-resources/vo-resources-overview/vo-resources-overview.component';
import { VoResourcesPreviewComponent } from './pages/vo-detail-page/vo-resources/vo-resources-preview/vo-resources-preview.component';
import { VoResourcesStatesComponent } from './pages/vo-detail-page/vo-resources/vo-resources-states/vo-resources-states.component';
import { VoResourcesTagsComponent } from './pages/vo-detail-page/vo-resources/vo-resources-tags/vo-resources-tags.component';
import { GroupSettingsExpirationComponent } from './pages/group-detail-page/group-settings/group-settings-expiration/group-settings-expiration.component';
import { GroupSettingsManagersComponent } from './pages/group-detail-page/group-settings/group-settings-managers/group-settings-managers.component';
import { VoSettingsNotificationsComponent } from './pages/vo-detail-page/vo-settings/vo-settings-notifications/vo-settings-notifications.component';
import { GroupSettingsNotificationsComponent } from './pages/group-detail-page/group-settings/group-settings-notifications/group-settings-notifications.component';
import { VoSettingsExtsourcesComponent } from './pages/vo-detail-page/vo-settings/vo-settings-extsources/vo-settings-extsources.component';
import { GroupSettingsRelationsComponent } from './pages/group-detail-page/group-settings/group-settings-relations/group-settings-relations.component';
import { MemberResourcesComponent } from './pages/member-detail-page/member-resources/member-resources.component';
import { ResourceDetailPageComponent } from '../facilities/pages/resource-detail-page/resource-detail-page.component';
import { ResourceOverviewComponent } from '../facilities/pages/resource-detail-page/resource-overview/resource-overview.component';
import { ResourceGroupsComponent } from '../facilities/pages/resource-detail-page/resource-groups/resource-groups.component';
import { ResourceSettingsComponent } from '../facilities/pages/resource-detail-page/resource-settings/resource-settings.component';
import { ResourceSettingsOverviewComponent } from '../facilities/pages/resource-detail-page/resource-settings/resource-settings-overview/resource-settings-overview.component';
import { ResourceAttributesComponent } from '../facilities/pages/resource-detail-page/resource-attributes/resource-attributes.component';
import { ResourceSettingsManagersComponent } from '../facilities/pages/resource-detail-page/resource-settings/resource-settings-managers/resource-settings-managers.component';
import { ResourceAssignedServicesComponent } from '../facilities/pages/resource-detail-page/resource-assigned-services/resource-assigned-services.component';
import { ResourceAssignedMembersComponent } from '../facilities/pages/resource-detail-page/resource-assigned-members/resource-assigned-members.component';
import { VoSettingsSponsoredMembersComponent } from './pages/vo-detail-page/vo-settings/vo-settings-sponsored-members/vo-settings-sponsored-members.component';
import { GroupSettingsExtsourcesComponent } from './pages/group-detail-page/group-settings/group-settings-extsources/group-settings-extsources.component';
import { VoStatisticsComponent } from './pages/vo-detail-page/vo-statistics/vo-statistics.component';
import { GroupStatisticsComponent } from './pages/group-detail-page/group-statistics/group-statistics.component';
import { ResourceTagsComponent } from '../facilities/pages/resource-detail-page/resource-tags/resource-tags.component';
import { VoSettingsServiceMembersComponent } from './pages/vo-detail-page/vo-settings/vo-settings-service-members/vo-settings-service-members.component';
import { RouteAuthGuardService } from '../shared/route-auth-guard.service';
import { VoSettingsMemberOrganizationsComponent } from './pages/vo-detail-page/vo-settings/vo-settings-member-organizations/vo-settings-member-organizations.component';
import { VoSettingsHierarchicalInclusionComponent } from './pages/vo-detail-page/vo-settings/vo-settings-hierarchical-inclusion/vo-settings-hierarchical-inclusion.component';
import { GroupRolesComponent } from './pages/group-detail-page/group-roles/group-roles.component';
import { VoSettingsBansComponent } from './pages/vo-detail-page/vo-settings/vo-settings-bans/vo-settings-bans.component';
import { MemberBansComponent } from './pages/member-detail-page/member-bans/member-bans.component';
import { ResourceSettingsBansComponent } from '../facilities/pages/resource-detail-page/resource-settings/resource-settings-bans/resource-settings-bans.component';
import { GroupInvitationsComponent } from './pages/group-detail-page/group-invitations/group-invitations.component';
import { GroupInvitationDetailComponent } from './pages/group-detail-page/group-invitation-detail/group-invitation-detail.component';
import { SettingsApplicationFormSwitchComponent } from '../shared/components/registrar-switching/settings-application-form-switch/settings-application-form-switch.component';
import { ApplicationsPageSwitchComponent } from '../shared/components/registrar-switching/applications-page-switch/applications-page-switch.component';
import { ApplicationFormEmbeddedGroupsSwitchComponent } from '../shared/components/registrar-switching/application-form-embedded-groups-switch/application-form-embedded-groups-switch.component';
import { ApplicationFormPreviewSwitchComponent } from '../shared/components/registrar-switching/application-form-preview-switch/application-form-preview-switch.component';
import {
  newRegistrarAppDetailMatcher,
  oldRegistrarAppDetailMatcher,
} from '@perun-web-apps/perun/utils';
import { ApplicationDetailComponent } from './components/application-detail/application-detail.component';
import { ApplicationDetailNewRegComponent } from './components/application-detail-new-reg/application-detail-new-reg.component';
import { MemberApplicationsSwitchComponent } from '../shared/components/registrar-switching/member-applications-switch/member-applications-switch.component';

export const vosRoutes: Routes = [
  {
    path: '',
    component: VoSelectPageComponent,
  },
  {
    path: ':voId',
    component: VoDetailPageComponent,
    canActivateChild: [RouteAuthGuardService],
    children: [
      {
        path: '',
        component: VoOverviewComponent,
        data: { animation: 'VoOverviewPage' },
      },
      {
        path: 'attributes',
        component: VoAttributesComponent,
        data: { animation: 'VoAttributesPage' },
      },
      {
        path: 'groups',
        component: VoGroupsComponent,
        data: { animation: 'VoGroupsPage' },
      },
      {
        path: 'members',
        component: VoMembersComponent,
        data: { animation: 'VoMembersPage' },
      },
      {
        path: 'resources',
        component: VoResourcesComponent,
        children: [
          {
            path: '',
            component: VoResourcesOverviewComponent,
            data: { animation: 'VoResourcesOverviewPage' },
          },
          {
            path: 'preview',
            component: VoResourcesPreviewComponent,
            data: { animation: 'VoResourcesPreviewPage' },
          },
          {
            path: 'states',
            component: VoResourcesStatesComponent,
            data: { animation: 'VoResourcesStatesPage' },
          },
          {
            path: 'tags',
            component: VoResourcesTagsComponent,
            data: { animation: 'VoResourcesTagsPage' },
          },
        ],
      },
      {
        path: 'applications',
        component: ApplicationsPageSwitchComponent,
        data: { animation: 'VoApplicationsPage' },
      },
      {
        path: 'applications',
        children: [
          {
            matcher: oldRegistrarAppDetailMatcher,
            component: ApplicationDetailComponent,
            data: { animation: 'VoApplicationDetailPage' },
          },
          {
            matcher: newRegistrarAppDetailMatcher,
            component: ApplicationDetailNewRegComponent,
            data: { animation: 'VoApplicationDetailPage' },
          },
        ],
      },
      {
        path: 'sponsoredMembers',
        component: VoSettingsSponsoredMembersComponent,
        data: { animation: 'VoSettingsSponsoredMembersPage' },
      },
      {
        path: 'serviceAccounts',
        component: VoSettingsServiceMembersComponent,
        data: { animation: 'VoSettingsServiceMembersPage' },
      },
      {
        path: 'statistics',
        component: VoStatisticsComponent,
        data: { animation: 'VoStatisticsPage' },
      },
      {
        path: 'settings',
        component: VoSettingsComponent,
        children: [
          {
            path: '',
            component: VoSettingsOverviewComponent,
            data: { animation: 'VoSettingsOverviewPage' },
          },
          {
            path: 'expiration',
            component: VoSettingsExpirationComponent,
            data: { animation: 'VoSettingsExpirationPage' },
          },
          {
            path: 'managers',
            component: VoSettingsManagersComponent,
            data: { animation: 'VoSettingsManagersPage' },
          },
          {
            path: 'applicationForm',
            component: SettingsApplicationFormSwitchComponent,
            data: { animation: 'SettingsApplicationFormPage' },
          },
          {
            path: 'applicationForm/preview',
            component: ApplicationFormPreviewSwitchComponent,
            data: { animation: 'SettingsApplicationFormPreviewPage' },
          },
          {
            path: 'applicationForm/manageGroups',
            component: ApplicationFormEmbeddedGroupsSwitchComponent,
          },
          {
            path: 'notifications',
            component: VoSettingsNotificationsComponent,
            data: { animation: 'SettingsApplicationFormNotificationsPage' },
          },
          {
            path: 'extsources',
            component: VoSettingsExtsourcesComponent,
            data: { animation: 'VoSettingsExtSourcesPage' },
          },
          {
            path: 'memberOrganizations',
            component: VoSettingsMemberOrganizationsComponent,
            data: { animation: 'VoSettingsMemberOrganizationsPage' },
          },
          {
            path: 'hierarchicalInclusion',
            component: VoSettingsHierarchicalInclusionComponent,
            data: { animation: 'VoSettingsHierarchicalInclusionComponent' },
          },
          {
            path: 'bans',
            component: VoSettingsBansComponent,
            data: { animation: 'VoSettingsBansComponent' },
          },
        ],
      },
    ],
  },
  {
    path: ':voId/members/:memberId',
    component: MemberDetailPageComponent,
    canActivateChild: [RouteAuthGuardService],
    children: [
      {
        path: '',
        component: MemberOverviewComponent,
        data: { animation: 'MemberOverviewPage' },
      },
      {
        path: 'attributes',
        component: MemberAttributesComponent,
        data: { animation: 'MemberAttributesPage' },
      },
      {
        path: 'groups',
        component: MemberGroupsComponent,
        data: { animation: 'MemberGroupsPage' },
      },
      {
        path: 'applications',
        component: MemberApplicationsSwitchComponent,
        data: { animation: 'MemberApplicationsPage' },
      },
      {
        path: 'applications',
        children: [
          {
            matcher: oldRegistrarAppDetailMatcher,
            component: ApplicationDetailComponent,
            data: { animation: 'MemberApplicationDetailPage' },
          },
          {
            matcher: newRegistrarAppDetailMatcher,
            component: ApplicationDetailNewRegComponent,
            data: { animation: 'MemberApplicationDetailPage' },
          },
        ],
      },
      {
        path: 'resources',
        component: MemberResourcesComponent,
        data: { animation: 'MemberResourcesPage' },
      },
      {
        path: 'bans',
        component: MemberBansComponent,
        data: { animation: 'MemberBansPage' },
      },
    ],
  },
  {
    path: ':voId/groups/:groupId',
    component: GroupDetailPageComponent,
    canActivateChild: [RouteAuthGuardService],
    children: [
      {
        path: '',
        component: GroupOverviewComponent,
        data: { animation: 'GroupOverviewPage' },
      },
      {
        path: 'members',
        component: GroupMembersComponent,
        data: { animation: 'GroupMembersPage' },
      },
      {
        path: 'subgroups',
        component: GroupSubgroupsComponent,
        data: { animation: 'GroupSubgroupsPage' },
      },
      {
        path: 'applications',
        component: ApplicationsPageSwitchComponent,
        data: { animation: 'GroupApplicationsPage' },
      },
      {
        path: 'invitations',
        component: GroupInvitationsComponent,
        data: { animation: 'GroupInvitationsPage' },
      },
      {
        path: 'invitations/:invitationId',
        component: GroupInvitationDetailComponent,
        data: { animation: 'GroupInvitationDetailPage' },
      },
      {
        path: 'resources',
        component: GroupResourcesComponent,
        data: { animation: 'GroupResourcesPage' },
      },
      {
        path: 'attributes',
        component: GroupAttributesComponent,
        data: { animation: 'GroupAttributesPage' },
      },
      {
        path: 'statistics',
        component: GroupStatisticsComponent,
        data: { animation: 'GroupStatisticsPage' },
      },
      {
        path: 'roles',
        component: GroupRolesComponent,
        data: { animation: 'GroupRolesPage' },
      },
      {
        path: 'settings',
        component: GroupSettingsComponent,
        children: [
          {
            path: '',
            component: GroupSettingsOverviewComponent,
            data: { animation: 'GroupSettingsOverviewPage' },
          },
          {
            path: 'expiration',
            component: GroupSettingsExpirationComponent,
            data: { animation: 'GroupSettingsExpirationPage' },
          },
          {
            path: 'managers',
            component: GroupSettingsManagersComponent,
            data: { animation: 'GroupSettingsManagersPage' },
          },
          {
            path: 'applicationForm',
            component: SettingsApplicationFormSwitchComponent,
            data: { animation: 'GroupSettingsApplicationFormPage' },
          },
          {
            path: 'applicationForm/preview',
            component: ApplicationFormPreviewSwitchComponent,
          },
          {
            path: 'applicationForm/manageGroups',
            component: ApplicationFormEmbeddedGroupsSwitchComponent,
          },
          {
            path: 'notifications',
            component: GroupSettingsNotificationsComponent,
            data: { animation: 'GroupSettingsNotificationsPage' },
          },
          {
            path: 'relations',
            component: GroupSettingsRelationsComponent,
            data: { animation: 'GroupSettingsRelationsPage' },
          },
          {
            path: 'extsources',
            component: GroupSettingsExtsourcesComponent,
            data: { animation: 'GroupSettingsExtsourcesPage' },
          },
        ],
      },
      {
        path: 'applications',
        children: [
          {
            matcher: oldRegistrarAppDetailMatcher,
            component: ApplicationDetailComponent,
            data: { animation: 'GroupApplicationDetailPage' },
          },
          {
            matcher: newRegistrarAppDetailMatcher,
            component: ApplicationDetailNewRegComponent,
            data: { animation: 'GroupApplicationDetailPage' },
          },
        ],
      },
    ],
  },
  {
    path: ':voId/resources/:resourceId',
    component: ResourceDetailPageComponent,
    canActivateChild: [RouteAuthGuardService],
    children: [
      {
        path: '',
        component: ResourceOverviewComponent,
        data: { animation: 'ResourceOverviewPage' },
      },
      {
        path: 'groups',
        component: ResourceGroupsComponent,
        data: { animation: 'ResourceGroupsComponent' },
      },
      {
        path: 'services',
        component: ResourceAssignedServicesComponent,
        data: { animation: 'ResourceAssignedServicesComponent' },
      },
      {
        path: 'attributes',
        component: ResourceAttributesComponent,
        data: { animation: 'ResourceAttributesPage' },
      },
      {
        path: 'members',
        component: ResourceAssignedMembersComponent,
        data: { animation: 'ResourceAssignedMembersComponent' },
      },
      {
        path: 'tags',
        component: ResourceTagsComponent,
        data: { animation: 'ResourceTagsComponent' },
      },
      {
        path: 'settings',
        component: ResourceSettingsComponent,
        children: [
          {
            path: '',
            component: ResourceSettingsOverviewComponent,
            data: { animation: 'ResourceSettingsOverviewPage' },
          },
          {
            path: 'managers',
            component: ResourceSettingsManagersComponent,
            data: { animation: 'ResourceSettingsManagersPage' },
          },
          {
            path: 'bans',
            component: ResourceSettingsBansComponent,
            data: { animation: 'ResourceSettingsBansPage' },
          },
        ],
      },
    ],
  },
];
