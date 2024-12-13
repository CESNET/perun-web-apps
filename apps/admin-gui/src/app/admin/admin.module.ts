import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { SharedModule } from '../shared/shared.module';
import { AdminOverviewComponent } from './pages/admin-page/admin-overview/admin-overview.component';
import { AdminAttributesComponent } from './pages/admin-page/admin-attributes/admin-attributes.component';
import { AdminUsersComponent } from './pages/admin-page/admin-users/admin-users.component';
import { AdminUserDetailPageComponent } from './pages/admin-user-detail-page/admin-user-detail-page.component';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { UiLoadersModule } from '@perun-web-apps/ui/loaders';
import { AdminExtSourcesComponent } from './pages/admin-page/admin-ext-sources/admin-ext-sources.component';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { PerunPipesModule } from '@perun-web-apps/perun/pipes';
import { AdminServicesComponent } from './pages/admin-page/admin-services/admin-services.component';
import { ServiceDetailPageComponent } from './pages/admin-page/admin-services/service-detail-page/service-detail-page.component';
import { ServiceOverviewComponent } from './pages/admin-page/admin-services/service-detail-page/service-overview/service-overview.component';
import { ServiceRequiredAttributesComponent } from './pages/admin-page/admin-services/service-detail-page/service-required-attributes/service-required-attributes.component';
import { UsersModule } from '../users/users.module';
import { ServiceDestinationsComponent } from './pages/admin-page/admin-services/service-detail-page/service-destinations/service-destinations.component';
import { AdminOwnersComponent } from './pages/admin-page/admin-owners/admin-owners.component';
import { AdminAuditLogComponent } from './pages/admin-page/admin-audit-log/admin-audit-log.component';
import { AdminConsentHubsComponent } from './pages/admin-page/admin-consent-hubs/admin-consent-hubs.component';
import { AdminSearcherComponent } from './pages/admin-page/admin-searcher/admin-searcher.component';
import { AdminBlockedLoginsComponent } from './pages/admin-page/admin-blocked-logins/admin-blocked-logins.component';
import { AdminTasksComponent } from './pages/admin-page/admin-tasks/admin-tasks.component';

@NgModule({
  declarations: [
    AdminPageComponent,
    AdminOverviewComponent,
    AdminAttributesComponent,
    AdminUsersComponent,
    AdminUserDetailPageComponent,
    AdminExtSourcesComponent,
    AdminServicesComponent,
    ServiceDetailPageComponent,
    ServiceOverviewComponent,
    ServiceRequiredAttributesComponent,
    ServiceDestinationsComponent,
    AdminOwnersComponent,
    AdminAuditLogComponent,
    AdminConsentHubsComponent,
    AdminSearcherComponent,
    AdminBlockedLoginsComponent,
    AdminTasksComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    UiAlertsModule,
    UiLoadersModule,
    PerunSharedComponentsModule,
    PerunPipesModule,
    UsersModule,
  ],
})
export class AdminModule {}
