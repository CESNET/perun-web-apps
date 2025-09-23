import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { IdentitiesPageComponent } from './pages/identities-page/identities-page.component';
import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { VosPageComponent } from './pages/vos-page/vos-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { AuthenticationAlternativePasswordsComponent } from './pages/authentication-page/authentication-alternative-passwords/authentication-alternative-passwords.component';
import { SettingsOverviewComponent } from './pages/settings-page/settings-overview/settings-overview.component';
import { SettingsPreferredShellsComponent } from './pages/settings-page/settings-preferred-shells/settings-preferred-shells.component';
import { SettingsPreferredUnixGroupNamesComponent } from './pages/settings-page/settings-preferred-unix-group-names/settings-preferred-unix-group-names.component';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import {
  LoginScreenComponent,
  LoginScreenServiceAccessComponent,
} from '@perun-web-apps/perun/login';
import { ConsentsPageComponent } from './pages/consents-page/consents-page.component';
import { ConsentRequestComponent } from './pages/consents-page/consent-request/consent-request.component';
import { ConsentsPreviewComponent } from './pages/consents-page/consents-preview/consents-preview.component';
import { SettingsMailingListsComponent } from './pages/settings-page/settings-mailing-lists/settings-mailing-lists.component';
import { SettingsDataQuotasComponent } from './pages/settings-page/settings-data-quotas/settings-data-quotas.component';
import { LogoutLoaderComponent } from '@perun-web-apps/ui/loaders';
import { AuthenticationPageComponent } from './pages/authentication-page/authentication-page.component';
import { AuthenticationOverviewComponent } from './pages/authentication-page/authentication-overview/authentication-overview.component';
import { AuthenticationMfaSettingsComponent } from './pages/authentication-page/authentication-mfa-settings/authentication-mfa-settings.component';
import { AuthenticationAntiPhishingSecurityComponent } from './pages/authentication-page/authentication-anti-phishing-security/authentication-anti-phishing-security.component';
import { AuthenticationAccountActivationComponent } from './pages/authentication-page/authentication-account-activation/authentication-account-activation.component';
import { PasswordResetComponent, SettingsSSHKeysComponent } from '@perun-web-apps/perun/components';
import { BansPageComponent } from './pages/bans-page/bans-page.component';
import { RolesPageComponent } from './pages/roles-page/roles-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginScreenComponent,
  },
  {
    path: 'service-access',
    component: LoginScreenServiceAccessComponent,
  },
  {
    path: 'logout',
    component: LogoutLoaderComponent,
  },
  {
    path: 'profile',
    component: HomePageComponent,
    data: { breadcrumb: 'MENU_ITEMS.PROFILE' },
    children: [
      {
        path: '',
        component: ProfilePageComponent,
        data: { breadcrumb: 'MENU_ITEMS.PROFILE' },
      },
      {
        path: 'identities',
        component: IdentitiesPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.IDENTITIES' },
      },
      {
        path: 'groups',
        component: GroupsPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.GROUPS' },
      },
      {
        path: 'services',
        component: ServicesPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.SERVICES' },
      },
      {
        path: 'organizations',
        component: VosPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.VOS' },
      },
      {
        path: 'bans',
        component: BansPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.BANS' },
      },
      {
        path: 'roles',
        component: RolesPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.ROLES' },
      },
      {
        path: 'privacy',
        component: PrivacyPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.PRIVACY' },
      },
      {
        path: 'consents',
        component: ConsentsPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.CONSENTS' },
        children: [
          {
            path: '',
            component: ConsentsPreviewComponent,
            data: { breadcrumb: 'MENU_ITEMS.CONSENTS' },
          },
          {
            path: ':consentId',
            component: ConsentRequestComponent,
            data: { breadcrumb: 'MENU_ITEMS.CONSENT_REQUEST' },
          },
        ],
      },
      {
        path: 'auth',
        component: AuthenticationPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.AUTHENTICATION' },
        children: [
          {
            path: '',
            component: AuthenticationOverviewComponent,
            data: { breadcrumb: 'MENU_ITEMS.AUTHENTICATION' },
          },
          {
            path: 'accountActivation',
            component: AuthenticationAccountActivationComponent,
            data: { breadcrumb: 'AUTHENTICATION.ACCOUNT_ACTIVATION' },
          },
          {
            path: 'mfa',
            component: AuthenticationMfaSettingsComponent,
            data: { breadcrumb: 'AUTHENTICATION.MFA' },
          },
          {
            path: 'antiPhishingSecurity',
            component: AuthenticationAntiPhishingSecurityComponent,
            data: { breadcrumb: 'AUTHENTICATION.ANTI_PHISHING' },
          },
          {
            path: 'sshKeys',
            component: SettingsSSHKeysComponent,
            data: { breadcrumb: 'AUTHENTICATION.SSH_KEYS' },
          },
          {
            path: 'passwordReset',
            component: PasswordResetComponent,
            data: { breadcrumb: 'AUTHENTICATION.PASSWORD_RESET' },
          },
          {
            path: 'altPasswords',
            component: AuthenticationAlternativePasswordsComponent,
            data: { breadcrumb: 'AUTHENTICATION.ALTERNATIVE_PASSWORDS' },
          },
        ],
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
        data: { breadcrumb: 'MENU_ITEMS.SETTINGS' },
        children: [
          {
            path: '',
            component: SettingsOverviewComponent,
            data: { breadcrumb: 'MENU_ITEMS.SETTINGS' },
          },
          {
            path: 'dataQuotas',
            component: SettingsDataQuotasComponent,
            data: { breadcrumb: 'SETTINGS.DATA_QUOTAS' },
          },
          {
            path: 'mailingLists',
            component: SettingsMailingListsComponent,
            data: { breadcrumb: 'SETTINGS.MAILING_LISTS' },
          },
          {
            path: 'prefShells',
            component: SettingsPreferredShellsComponent,
            data: { breadcrumb: 'SETTINGS.PREFERRED_SHELLS' },
          },
          {
            path: 'prefGroupNames',
            component: SettingsPreferredUnixGroupNamesComponent,
            data: { breadcrumb: 'SETTINGS.PREFERRED_UNIX_GROUP_NAMES' },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
    }),
  ],
})
export class AppRoutingModule {}
