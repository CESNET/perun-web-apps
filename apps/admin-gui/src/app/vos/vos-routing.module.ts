import {RouterModule, Routes} from '@angular/router';
import {VoSelectPageComponent} from './pages/vo-select-page/vo-select-page.component';
import {NgModule} from '@angular/core';
import {GroupDetailPageComponent} from './pages/group-detail-page/group-detail-page.component';
import {MemberDetailPageComponent} from './pages/member-detail-page/member-detail-page.component';
import {VoOverviewComponent} from './pages/vo-detail-page/vo-overview/vo-overview.component';
import {VoGroupsComponent} from './pages/vo-detail-page/vo-groups/vo-groups.component';
import {VoMembersComponent} from './pages/vo-detail-page/vo-members/vo-members.component';
import {VoDetailPageComponent} from './pages/vo-detail-page/vo-detail-page.component';
import {MemberOverviewComponent} from './pages/member-detail-page/member-overview/member-overview.component';
import {MemberGroupsComponent} from './pages/member-detail-page/member-groups/member-groups.component';
import {GroupOverviewComponent} from './pages/group-detail-page/group-overview/group-overview.component';
import {GroupSubgroupsComponent} from './pages/group-detail-page/group-subgroups/group-subgroups.component';
import {VoResourcesComponent} from './pages/vo-detail-page/vo-resources/vo-resources.component';
import {VoApplicationsComponent} from './pages/vo-detail-page/vo-applications/vo-applications.component';
import {VoSettingsComponent} from './pages/vo-detail-page/vo-settings/vo-settings.component';
import {VoSettingsAttributesComponent} from './pages/vo-detail-page/vo-settings/vo-settings-attributes/vo-settings-attributes.component';
import {VoSettingsOverviewComponent} from './pages/vo-detail-page/vo-settings/vo-settings-overview/vo-settings-overview.component';
import {VoSettingsExpirationComponent} from './pages/vo-detail-page/vo-settings/vo-settings-expiration/vo-settings-expiration.component';
import {GroupApplicationsComponent} from './pages/group-detail-page/group-applications/group-applications.component';
import {VoSettingsManagersComponent} from './pages/vo-detail-page/vo-settings/vo-settings-managers/vo-settings-managers.component';
import {ApplicationDetailComponent} from './components/application-detail/application-detail.component';
import {GroupMembersComponent} from './pages/group-detail-page/group-members/group-members.component';
import {GroupResourcesComponent} from './pages/group-detail-page/group-resources/group-resources.component';
import {GroupSettingsComponent} from './pages/group-detail-page/group-settings/group-settings.component';
import {
  GroupSettingsAttributesComponent
} from './pages/group-detail-page/group-settings/group-settings-attributes/group-settings-attributes.component';
import {GroupSettingsOverviewComponent
} from './pages/group-detail-page/group-settings/group-settings-overview/group-settings-overview.component';
import {
  VoSettingsApplicationFormComponent
} from './pages/vo-detail-page/vo-settings/vo-settings-application-form/vo-settings-application-form.component';
// tslint:disable-next-line:max-line-length
import { ApplicationFormPreviewComponent } from './components/application-form-preview/application-form-preview.component';
// tslint:disable-next-line:max-line-length
import {MemberSettingsComponent} from './pages/member-detail-page/member-settings/member-settings.component';
import {
  MemberSettingsOverviewComponent
} from './pages/member-detail-page/member-settings/member-settings-overview/member-settings-overview.component';
import {
  MemberSettingsAttributesComponent
} from './pages/member-detail-page/member-settings/member-settings-attributes/member-settings-attributes.component';
import {VoResourcesOverviewComponent} from './pages/vo-detail-page/vo-resources/vo-resources-overview/vo-resources-overview.component';
import {VoResourcesPreviewComponent} from './pages/vo-detail-page/vo-resources/vo-resources-preview/vo-resources-preview.component';
import {VoResourcesStatesComponent} from './pages/vo-detail-page/vo-resources/vo-resources-states/vo-resources-states.component';
import {VoResourcesTagsComponent} from './pages/vo-detail-page/vo-resources/vo-resources-tags/vo-resources-tags.component';
import {
  GroupSettingsExpirationComponent
} from './pages/group-detail-page/group-settings/group-settings-expiration/group-settings-expiration.component';
import {
  GroupSettingsManagersComponent
} from './pages/group-detail-page/group-settings/group-settings-managers/group-settings-managers.component';
import {
  VoSettingsNotificationsComponent
} from './pages/vo-detail-page/vo-settings/vo-settings-notifications/vo-settings-notifications.component';
import {
  GroupSettingsApplicationFormComponent
} from './pages/group-detail-page/group-settings/group-settings-application-form/group-settings-application-form.component';
import {
  GroupSettingsNotificationsComponent
} from './pages/group-detail-page/group-settings/group-settings-notifications/group-settings-notifications.component';
import { VoSettingsExtsourcesComponent } from './pages/vo-detail-page/vo-settings/vo-settings-extsources/vo-settings-extsources.component';
import { GroupSettingsRelationsComponent } from './pages/group-detail-page/group-settings/group-settings-relations/group-settings-relations.component';
import { MemberSettingsResourceAttributesComponent } from './pages/member-detail-page/member-settings/member-settings-resource-attributes/member-settings-resource-attributes.component';
import { GroupSettingsResourceAttributesComponent } from './pages/group-detail-page/group-settings/group-settings-resource-attributes/group-settings-resource-attributes.component';
import { MemberSettingsGroupAttributesComponent } from './pages/member-detail-page/member-settings/member-settings-group-attributes/member-settings-group-attributes.component';
import { MemberResourcesComponent } from './pages/member-detail-page/member-resources/member-resources.component';

const routes: Routes = [
  {
    path: '',
    component: VoSelectPageComponent
  },
  {
    path: ':voId',
    component: VoDetailPageComponent,
    children: [
      {
        path: '',
        component: VoOverviewComponent,
        data: {animation: 'VoOverviewPage'}
      },
      {
        path: 'groups',
        component: VoGroupsComponent,
        data: {animation: 'VoGroupsPage'}
      },
      {
        path: 'members',
        component: VoMembersComponent,
        data: {animation: 'VoMembersPage'}
      },
      {
        path: 'resources',
        component: VoResourcesComponent,
        children: [
          {
            path: '',
            component: VoResourcesOverviewComponent,
            data: {animation: 'VoResourcesOverviewPage'}
          },
          {
            path: 'preview',
            component: VoResourcesPreviewComponent,
            data: {animation: 'VoResourcesPreviewPage'}
          },
          {
            path: 'states',
            component: VoResourcesStatesComponent,
            data: {animation: 'VoResourcesStatesPage'}
          },
          {
            path: 'tags',
            component: VoResourcesTagsComponent,
            data: {animation: 'VoResourcesTagsPage'}
          }
        ]
      },
      {
        path: 'applications',
        component: VoApplicationsComponent,
        data: {animation: 'VoApplicationsPage'}
      },
      {
        path: 'applications/:applicationId',
        component: ApplicationDetailComponent,
        data: {animation: 'VoApplicationDetailPage'}
      },
      {
        path: 'settings',
        component: VoSettingsComponent,
        children: [
          {
            path: '',
            component: VoSettingsOverviewComponent,
            data: {animation: 'VoSettingsOverviewPage'}
          },
          {
            path: 'attributes',
            component: VoSettingsAttributesComponent,
            data: {animation: 'VoSettingsAttributesPage'}
          },
          {
            path: 'expiration',
            component: VoSettingsExpirationComponent,
            data: {animation: 'VoSettingsExpirationPage'}
          },
          {
            path: 'managers',
            component: VoSettingsManagersComponent,
            data: {animation: 'VoSettingsManagersPage'}
          },
          {
            path: 'applicationForm',
            component: VoSettingsApplicationFormComponent,
            data: {animation: 'SettingsApplicationFormPage'}
          },
          {
            path: 'applicationForm/preview',
            component: ApplicationFormPreviewComponent,
            data: {animation: 'SettingsApplicationFormPreviewPage'}
          },
          {
            path: 'notifications',
            component: VoSettingsNotificationsComponent,
            data: {animation: 'SettingsApplicationFormNotificationsPage'}
          },
          {
            path: 'extsources',
            component: VoSettingsExtsourcesComponent,
            data: {animation: 'VoSettingsExtSourcesPage'}
          }
        ]
      }
    ]
  },
  {
    path: ':voId/members/:memberId',
    component: MemberDetailPageComponent,
    children: [
      {
        path: '',
        component: MemberOverviewComponent,
        data: {animation: 'MemberOverviewPage'}
      },
      {
        path: 'groups',
        component: MemberGroupsComponent,
        data: {animation: 'MemberGroupsPage'}
      },
      {
        path: 'resources',
        component: MemberResourcesComponent,
        data: {animation: 'MemberResourcesPage'}
      },
      {
        path: 'settings',
        component: MemberSettingsComponent,
        children: [
          {
            path: '',
            component: MemberSettingsOverviewComponent,
            data: {animation: 'MemberSettingsOverviewPage'}
          },
          {
            path: 'attributes',
            component: MemberSettingsAttributesComponent,
            data: {animation: 'MemberSettingsAttributesPage'}
          },
          {
            path: 'resourceAttributes',
            component: MemberSettingsResourceAttributesComponent,
            data: {animation: 'MemberSettingsResourceAttributesPage'}
          },
          {
            path: 'groupAttributes',
            component: MemberSettingsGroupAttributesComponent,
            data: {animation: 'MemberSettingsGroupAttributesPage'}
          },
        ]
      }
    ]
  },
  {
    path: ':voId/groups/:groupId',
    component: GroupDetailPageComponent,
    children: [
      {
        path: '',
        component: GroupOverviewComponent,
        data: {animation: 'GroupOverviewPage'}
      },
      {
        path: 'members',
        component: GroupMembersComponent,
        data: {animation: 'GroupMembersPage'}
      },
      {
        path: 'subgroups',
        component: GroupSubgroupsComponent,
        data: {animation: 'GroupSubgroupsPage'}
      },
      {
        path: 'applications',
        component: GroupApplicationsComponent,
        data: {animation: 'GroupApplicationsPage'}
      },
      {
        path: 'resources',
        component: GroupResourcesComponent,
        data: {animation: 'GroupResourcesPage'}
      },
      {
        path: 'settings',
        component: GroupSettingsComponent,
        children: [
          {
            path: '',
            component: GroupSettingsOverviewComponent,
            data: {animation: 'GroupSettingsOverviewPage'}
          },
          {
            path: 'attributes',
            component: GroupSettingsAttributesComponent,
            data: {animation: 'GroupSettingsAttributesPage'}
          },
          {
            path: 'resourceAttributes',
            component: GroupSettingsResourceAttributesComponent,
            data: {animation: 'GroupSettingsResourceAttributesPage'}
          },
          {
            path: 'groupAttributes',
            component: MemberSettingsGroupAttributesComponent,
            data: {animation: 'MemberSettingsGroupAttributesPage'}
          },
          {
            path: 'expiration',
            component: GroupSettingsExpirationComponent,
            data: {animation: 'GroupSettingsExpirationPage'}
          },
          {
            path: 'managers',
            component: GroupSettingsManagersComponent,
            data: {animation: 'GroupSettingsManagersPage'}
          },
          {
            path: 'applicationForm',
            component: GroupSettingsApplicationFormComponent,
            data: {animation: 'GroupSettingsApplicationFormPage'}
          },
          {
            path: 'applicationForm/preview',
            component: ApplicationFormPreviewComponent,
          },
          {
            path: 'notifications',
            component: GroupSettingsNotificationsComponent,
            data: {animation: 'GroupSettingsNotificationsPage'}
          },
          {
            path: 'relations',
            component: GroupSettingsRelationsComponent,
            data: {animation: 'GroupSettingsRelationsPage'}
          }
        ]
      },
      {
        path: 'applications/:applicationId',
        component: ApplicationDetailComponent,
        data: {animation: 'GroupApplicationDetailPage'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VosRoutingModule { }
