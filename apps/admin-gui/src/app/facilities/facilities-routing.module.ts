import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FacilitySelectPageComponent} from './pages/facility-select-page/facility-select-page.component';
import {FacilityDetailPageComponent} from './pages/facility-detail-page/facility-detail-page.component';
import {FacilityOverviewComponent} from './pages/facility-detail-page/facility-overview/facility-overview.component';
import {FacilityResourcesComponent} from './pages/facility-detail-page/facility-resources/facility-resources.component';
import {FacilityAllowedGroupsComponent} from './pages/facility-detail-page/facility-allowed-groups/facility-allowed-groups.component';
import {ResourceDetailPageComponent} from './pages/resource-detail-page/resource-detail-page.component';
import {ResourceOverviewComponent} from './pages/resource-detail-page/resource-overview/resource-overview.component';
import {FacilitySettingsComponent} from './pages/facility-detail-page/facility-settings/facility-settings.component';
import {
  FacilitySettingsOverviewComponent
} from './pages/facility-detail-page/facility-settings/facility-settings-overview/facility-settings-overview.component';
import {
  FacilitySettingsAttributesComponent
} from './pages/facility-detail-page/facility-settings/facility-settings-attributes/facility-settings-attributes.component';
import {ResourceSettingsComponent} from './pages/resource-detail-page/resource-settings/resource-settings.component';
import {
  ResourceSettingsOverviewComponent
} from './pages/resource-detail-page/resource-settings/resource-settings-overview/resource-settings-overview.component';
import {
  ResourceSettingsAttributesComponent
} from './pages/resource-detail-page/resource-settings/resource-settings-attributes/resource-settings-attributes.component';
import { ResourceGroupsComponent } from './pages/resource-detail-page/resource-groups/resource-groups.component';
import { FacilityServiceConfigComponent } from './pages/facility-detail-page/facility-service-config/facility-service-config.component';
import { FacilitySettingsManagersComponent } from './pages/facility-detail-page/facility-settings/facility-settings-managers/facility-settings-managers.component';
import { FacilityServicesDestinationsComponent } from './pages/facility-detail-page/facility-services-destinations/facility-services-destinations.component';
import { FacilitySettingsOwnersComponent } from './pages/facility-detail-page/facility-settings/facility-settings-owners/facility-settings-owners.component';
import { FacilityHostsComponent } from './pages/facility-detail-page/facility-hosts/facility-hosts.component';
import { FacilitySecurityTeamsComponent } from './pages/facility-detail-page/facility-security-teams/facility-security-teams.component';

const routes: Routes = [
  {
    path: '',
    component: FacilitySelectPageComponent
  },
  {
    path: ':facilityId',
    component: FacilityDetailPageComponent,
    children: [
      {
        path: '',
        component: FacilityOverviewComponent,
        data: {animation: 'FacilityOverviewPage'}
      },
      {
        path: 'resources',
        component: FacilityResourcesComponent,
        data: {animation: 'FacilityResourcesPage'}
      },
      {
        path: 'allowed-groups',
        component: FacilityAllowedGroupsComponent,
        data: {animation: 'FacilityAllowedGroupsPage'}
      },
      {
        path: 'service-config',
        component: FacilityServiceConfigComponent,
        data: {animation: 'FacilityServiceConfigPage'}
      },{
        path: 'services-destinations',
        component: FacilityServicesDestinationsComponent,
        data: {animation: 'FacilityServicesDestinationsPage'}
      },
      {
        path: 'hosts',
        component: FacilityHostsComponent,
        data: {animation: 'FacilityHostsPage'}
      },
      {
        path: 'security-teams',
        component: FacilitySecurityTeamsComponent,
        data: {animation: 'FacilitySecurityTeamsPage'}
      },
      {
        path: 'settings',
        component: FacilitySettingsComponent,
        children: [
          {
            path: '',
            component: FacilitySettingsOverviewComponent,
            data: {animation: 'FacilitySettingsOverviewPage'}
          },
          {
            path: 'attributes',
            component: FacilitySettingsAttributesComponent,
            data: {animation: 'FacilitySettingsAttributesPage'}
          },
          {
            path: 'owners',
            component: FacilitySettingsOwnersComponent,
            data: {animation: 'FacilitySettingOwnersPage'}
          },
          {
            path: 'managers',
            component: FacilitySettingsManagersComponent,
            data: {animation: 'FacilitySettingsManagersPage'}
          }
        ]
      }
    ]
  },
  {
    path: ':facilityId/resources/:resourceId',
    component: ResourceDetailPageComponent,
    children: [
      {
        path: '',
        component: ResourceOverviewComponent,
        data: {animation: 'ResourceOverviewPage'}
      },
      {
        path: 'groups',
        component: ResourceGroupsComponent,
        data: {animation: 'ResourceGroupsComponent'}
      },
      {
        path: 'settings',
        component: ResourceSettingsComponent,
        children: [
          {
            path: '',
            component: ResourceSettingsOverviewComponent,
            data: {animation: 'ResourceSettingsOverviewPage'}
          },
          {
            path: 'attributes',
            component: ResourceSettingsAttributesComponent,
            data: {animation: 'ResourceSettingsAttributesPage'}
          }
        ]
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilitiesRoutingModule { }
