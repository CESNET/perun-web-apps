import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminOverviewComponent } from './pages/admin-page/admin-overview/admin-overview.component';
import { AdminAttributesComponent } from './pages/admin-page/admin-attributes/admin-attributes.component';
import { AdminUsersComponent } from './pages/admin-page/admin-users/admin-users.component';
import { AdminUserDetailPageComponent } from './pages/admin-user-detail-page/admin-user-detail-page.component';
import { UserOverviewComponent } from '../users/pages/user-detail-page/user-overview/user-overview.component';
import { UserAttributesComponent } from '../users/pages/user-detail-page/user-attributes/user-attributes.component';
import { AdminExtSourcesComponent } from './pages/admin-page/admin-ext-sources/admin-ext-sources.component';
import { UserRolesComponent } from '../users/pages/user-detail-page/user-settings/user-roles/user-roles.component';
import { UserSettingsServiceIdentitiesComponent } from '../users/pages/user-detail-page/user-settings/user-settings-service-identities/user-settings-service-identities.component';
import { UserIdentitiesComponent } from '../users/pages/user-detail-page/user-identities/user-identities.component';
import { AdminServicesComponent } from './pages/admin-page/admin-services/admin-services.component';
import { IdentityDetailComponent } from '../shared/components/identity-detail/identity-detail.component';
import { ServiceDetailPageComponent } from './pages/admin-page/admin-services/service-detail-page/service-detail-page.component';
import { ServiceOverviewComponent } from './pages/admin-page/admin-services/service-detail-page/service-overview/service-overview.component';
import { ServiceRequiredAttributesComponent } from './pages/admin-page/admin-services/service-detail-page/service-required-attributes/service-required-attributes.component';
import { UserSettingsAssociatedUsersComponent } from '../users/pages/user-detail-page/user-settings/user-settings-associated-users/user-settings-associated-users.component';
import { ServiceDestinationsComponent } from './pages/admin-page/admin-services/service-detail-page/service-destinations/service-destinations.component';
import { UserAccountsComponent } from '../users/pages/user-detail-page/user-accounts/user-accounts.component';
import { AdminAuditLogComponent } from './pages/admin-page/admin-audit-log/admin-audit-log.component';
import { AdminConsentHubsComponent } from './pages/admin-page/admin-consent-hubs/admin-consent-hubs.component';
import { AdminSearcherComponent } from './pages/admin-page/admin-searcher/admin-searcher.component';
import { RouteAuthGuardService } from '../shared/route-auth-guard.service';
import { UserBansComponent } from '../users/pages/user-detail-page/user-bans/user-bans.component';
import { AdminBlockedLoginsComponent } from './pages/admin-page/admin-blocked-logins/admin-blocked-logins.component';
import { UserAssignmentsComponent } from '../users/pages/user-detail-page/user-assignments/user-assignments.component';
import { AdminTasksComponent } from './pages/admin-page/admin-tasks/admin-tasks.component';
import { UserApplicationsComponent } from '../users/pages/user-detail-page/user-applications/user-applications.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    canActivateChild: [RouteAuthGuardService],
    children: [
      {
        path: '',
        component: AdminOverviewComponent,
        data: { animation: 'AdminOverviewPage' },
      },
      {
        path: 'attributes',
        component: AdminAttributesComponent,
        data: { animation: 'AdminAttributesPage' },
      },
      {
        path: 'users',
        component: AdminUsersComponent,
        data: { animation: 'AdminUsersPage' },
      },
      {
        path: 'services',
        component: AdminServicesComponent,
        data: { animation: 'AdminServicesPage' },
      },
      {
        path: 'audit_log',
        component: AdminAuditLogComponent,
        data: { animation: 'AdminAuditLogPage' },
      },
      {
        path: 'ext_sources',
        component: AdminExtSourcesComponent,
        data: { animation: 'AdminExtSourcesPage' },
      },
      {
        path: 'consent_hubs',
        component: AdminConsentHubsComponent,
        data: { animation: 'AdminConsentHubsPage' },
      },
      {
        path: 'searcher',
        component: AdminSearcherComponent,
        data: { animation: 'AdminSearcherPage' },
      },
      {
        path: 'blocked_logins',
        component: AdminBlockedLoginsComponent,
        data: { animation: 'AdminBlockedLoginsPage' },
      },
      {
        path: 'tasks',
        component: AdminTasksComponent,
        data: { animation: 'AdminTasksComponent' },
      },
    ],
  },
  {
    path: 'users/:userId',
    component: AdminUserDetailPageComponent,
    canActivateChild: [RouteAuthGuardService],
    children: [
      {
        path: '',
        component: UserOverviewComponent,
        data: { animation: 'UserOverviewPage' },
      },
      {
        path: 'accounts',
        component: UserAccountsComponent,
        data: { animation: 'UserAccountsPage' },
      },
      {
        path: 'assignments',
        component: UserAssignmentsComponent,
        data: { animation: 'UserAssignmentsPage' },
      },
      {
        path: 'attributes',
        component: UserAttributesComponent,
        data: { animation: 'UserAttributesPage' },
      },
      {
        path: 'identities',
        component: UserIdentitiesComponent,
        data: { animation: 'UserIdentitiesPage' },
      },
      {
        path: 'identities/:identityId',
        component: IdentityDetailComponent,
        data: { animation: 'UserIdentityDetailPage' },
      },
      {
        path: 'roles',
        component: UserRolesComponent,
        data: { animation: 'UserRolesPage' },
      },
      {
        path: 'service-identities',
        component: UserSettingsServiceIdentitiesComponent,
        data: { animation: 'UserServiceIdentities' },
      },
      {
        path: 'associated-users',
        component: UserSettingsAssociatedUsersComponent,
        data: { animation: 'AssociatedUsersPage' },
      },
      {
        path: 'bans',
        component: UserBansComponent,
        data: { animation: 'UserBansPage' },
      },
      {
        path: 'applications',
        component: UserApplicationsComponent,
        data: { animation: 'UserApplicationsPage' },
      },
      // {
      //   path: 'settings',
      //   component: UserSettingsComponent,
      //   children: [
      //     {
      //       path: '',
      //       component: UserSettingsOverviewComponent,
      //       data: {animation: 'UserSettingsOverviewPage'}
      //     }
      //   ]
      // }
    ],
  },
  {
    path: 'services/:serviceId',
    component: ServiceDetailPageComponent,
    canActivateChild: [RouteAuthGuardService],
    children: [
      {
        path: '',
        component: ServiceOverviewComponent,
        data: { animation: 'ServiceOverviewPage' },
      },
      {
        path: 'required-attributes',
        component: ServiceRequiredAttributesComponent,
        data: { animation: 'ServiceRequiredAttributesPage' },
      },
      {
        path: 'destinations',
        component: ServiceDestinationsComponent,
        data: { animation: 'ServiceDestinationsPage' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
