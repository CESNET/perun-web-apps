import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacilitiesRoutingModule } from './facilities-routing.module';
import { FacilitySelectPageComponent } from './pages/facility-select-page/facility-select-page.component';
import {SharedModule} from '../shared/shared.module';
import { FacilitySelectTableComponent } from './components/facility-select-table/facility-select-table.component';
import { FacilityDetailPageComponent } from './pages/facility-detail-page/facility-detail-page.component';
import { FacilityOverviewComponent } from './pages/facility-detail-page/facility-overview/facility-overview.component';
import { FacilityResourcesComponent } from './pages/facility-detail-page/facility-resources/facility-resources.component';
import {FacilityAllowedGroupsComponent} from './pages/facility-detail-page/facility-allowed-groups/facility-allowed-groups.component';
import { ResourceDetailPageComponent } from './pages/resource-detail-page/resource-detail-page.component';
import { ResourceOverviewComponent } from './pages/resource-detail-page/resource-overview/resource-overview.component';
import { FacilitySettingsComponent } from './pages/facility-detail-page/facility-settings/facility-settings.component';
import {
  FacilitySettingsOverviewComponent
} from './pages/facility-detail-page/facility-settings/facility-settings-overview/facility-settings-overview.component';
import {
  FacilitySettingsAttributesComponent
} from './pages/facility-detail-page/facility-settings/facility-settings-attributes/facility-settings-attributes.component';
import { ResourceSettingsComponent } from './pages/resource-detail-page/resource-settings/resource-settings.component';
import {
  ResourceSettingsOverviewComponent
} from './pages/resource-detail-page/resource-settings/resource-settings-overview/resource-settings-overview.component';
import {
  ResourceSettingsAttributesComponent
} from './pages/resource-detail-page/resource-settings/resource-settings-attributes/resource-settings-attributes.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { ResourceGroupsComponent } from './pages/resource-detail-page/resource-groups/resource-groups.component';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';

@NgModule({
  declarations: [
    FacilitySelectPageComponent,
    FacilitySelectTableComponent,
    FacilityDetailPageComponent,
    FacilityOverviewComponent,
    FacilityResourcesComponent,
    FacilityAllowedGroupsComponent,
    ResourceDetailPageComponent,
    ResourceOverviewComponent,
    FacilitySettingsComponent,
    FacilitySettingsOverviewComponent,
    FacilitySettingsAttributesComponent,
    ResourceSettingsComponent,
    ResourceSettingsOverviewComponent,
    ResourceSettingsAttributesComponent,
    ResourceGroupsComponent
  ],
  imports: [
    CommonModule,
    FacilitiesRoutingModule,
    MatTableExporterModule,
    SharedModule,
    UiAlertsModule,
    PerunSharedComponentsModule
  ]
})
export class FacilitiesModule { }
