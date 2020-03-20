import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import {SharedModule} from '../shared/shared.module';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdminOverviewComponent } from './pages/admin-page/admin-overview/admin-overview.component';
import { AdminAttributesComponent } from './pages/admin-page/admin-attributes/admin-attributes.component';
import { AttrDefListComponent } from './components/attr-def-list/attr-def-list.component';
import { AdminVisualizerComponent } from './pages/admin-page/admin-visualizer/admin-visualizer.component';
import {
  VisualizerAttrModulesComponent
} from './pages/admin-page/admin-visualizer/visualizer-attr-modules/visualizer-attr-modules.component';
import { VisualizerOverviewComponent } from './pages/admin-page/admin-visualizer/visualizer-overview/visualizer-overview.component';
import {
  UserDestinationRelationshipComponent
} from './pages/admin-page/admin-visualizer/user-destination-relationship/user-destination-relationship.component';
import {
  UserDestinationGraphComponent
} from './pages/admin-page/admin-visualizer/user-destination-relationship/user-destination-graph/user-destination-graph.component';
import { AdminUsersComponent } from './pages/admin-page/admin-users/admin-users.component';
import { AdminUserDetailPageComponent } from './pages/admin-user-detail-page/admin-user-detail-page.component';
// tslint:disable-next-line:max-line-length
import {CreateAttributeDefinitionDialogComponent} from '../shared/components/dialogs/create-attribute-definition-dialog/create-attribute-definition-dialog.component';
// tslint:disable-next-line:max-line-length
import {DeleteAttributeDefinitionDialogComponent} from '../shared/components/dialogs/delete-attribute-definition-dialog/delete-attribute-definition-dialog.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { AdminExtSourcesComponent } from './pages/admin-page/admin-ext-sources/admin-ext-sources.component';
import { EditAttributeDefinitionDialogComponent } from '../shared/components/dialogs/edit-attribute-definition-dialog/edit-attribute-definition-dialog.component';
import { EntitylessAttributeKeysListComponent } from '../shared/components/entityless-attribute-keys-list/entityless-attribute-keys-list.component';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';

@NgModule({
  declarations: [
    AdminPageComponent,
    AdminOverviewComponent,
    AdminAttributesComponent,
    AttrDefListComponent,
    AdminVisualizerComponent,
    VisualizerAttrModulesComponent,
    VisualizerOverviewComponent,
    UserDestinationRelationshipComponent,
    UserDestinationGraphComponent,
    AdminUsersComponent,
    AdminUserDetailPageComponent,
    AdminExtSourcesComponent
  ],
  imports: [
    NgxGraphModule,
    NgxChartsModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    MatTableExporterModule,
    UiAlertsModule,
    PerunSharedComponentsModule
  ],
})
export class AdminModule { }
