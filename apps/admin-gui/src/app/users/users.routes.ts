import { Routes } from '@angular/router';
import { SettingsSSHKeysComponent } from '@perun-web-apps/perun/components';
import { ServiceIdentitySelectPageComponent } from './pages/user-detail-page/user-settings/user-settings-service-identities/service-identity-select-page.component';
import { ServiceIdentityDetailPageComponent } from './pages/user-detail-page/user-settings/user-settings-service-identities/service-identity-detail-page/service-identity-detail-page.component';
import { ServiceIdentityOverviewComponent } from './pages/user-detail-page/user-settings/user-settings-service-identities/service-identity-detail-page/service-identity-overview/service-identity-overview.component';
import { UserSettingsAssociatedUsersComponent } from './pages/user-detail-page/user-settings/user-settings-associated-users/user-settings-associated-users.component';
import { UserSettingsMailingListsComponent } from './pages/user-detail-page/user-settings/user-settings-mailing-lists/user-settings-mailing-lists.component';
import { UserSettingsDataQuotasComponent } from './pages/user-detail-page/user-settings/user-settings-data-quotas/user-settings-data-quotas.component';
import { ServiceIdentityAuthenticationOverviewComponent } from './pages/user-detail-page/user-settings/user-settings-service-identities/service-identity-authentication/service-identity-authentication-overview/service-identity-authentication-overview.component';
import { UserSettingsLoginsComponent } from './pages/user-detail-page/user-settings/user-settings-logins/user-settings-logins.component';
import { ServiceIdentityAuthenticationComponent } from './pages/user-detail-page/user-settings/user-settings-service-identities/service-identity-authentication/service-identity-authentication.component';
import { ServiceIdentityCertificatesComponent } from './pages/user-detail-page/user-settings/user-settings-service-identities/service-identity-authentication/service-identity-certificates/service-identity-certificates.component';
import { RouteAuthGuardService } from '../shared/route-auth-guard.service';

export const usersRoutes: Routes = [
  {
    path: '',
    component: ServiceIdentitySelectPageComponent,
  },
  {
    path: ':userId',
    component: ServiceIdentityDetailPageComponent,
    canActivate: [RouteAuthGuardService],
    canActivateChild: [RouteAuthGuardService],
    children: [
      {
        path: '',
        component: ServiceIdentityOverviewComponent,
      },
      {
        path: 'associated-users',
        component: UserSettingsAssociatedUsersComponent,
      },
      {
        path: 'authentication',
        component: ServiceIdentityAuthenticationComponent,
        children: [
          {
            path: '',
            component: ServiceIdentityAuthenticationOverviewComponent,
          },
          {
            path: 'logins',
            component: UserSettingsLoginsComponent,
          },
          {
            path: 'certificates',
            component: ServiceIdentityCertificatesComponent,
          },
          {
            path: 'ssh-keys',
            component: SettingsSSHKeysComponent,
          },
        ],
      },
      {
        path: 'mailing-lists',
        component: UserSettingsMailingListsComponent,
      },
      {
        path: 'data-quotas',
        component: UserSettingsDataQuotasComponent,
      },
    ],
  },
];
