import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { IdentitiesPageComponent } from './pages/identities-page/identities-page.component';
import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { VosPageComponent } from './pages/vos-page/vos-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SettingsAlternativePasswordsComponent } from './pages/settings-page/settings-alternative-passwords/settings-alternative-passwords.component';
import { SettingsOverviewComponent } from './pages/settings-page/settings-overview/settings-overview.component';
import { SettingsDataQuotasComponent } from './pages/settings-page/settings-data-quotas/settings-data-quotas.component';
import { SettingsMailingListsComponent } from './pages/settings-page/settings-mailing-lists/settings-mailing-lists.component';
import { SettingsPreferredShellsComponent } from './pages/settings-page/settings-preferred-shells/settings-preferred-shells.component';
import { SettingsPreferredUnixGroupNamesComponent } from './pages/settings-page/settings-preferred-unix-group-names/settings-preferred-unix-group-names.component';
import { SettingsSambaPasswordComponent } from './pages/settings-page/settings-samba-password/settings-samba-password.component';
import { SettingsSSHKeysComponent } from './pages/settings-page/settings-ssh-keys/settings-ssh-keys.component';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo:'profile',
    pathMatch:'full'
  },
  {
    path: 'profile',
    component: HomePageComponent,
    data: { breadcrumb: 'Profile'},
    children: [
      {
        path: '',
        component: ProfilePageComponent,
        data: { breadcrumb: 'Profile'},
      },
      {
        path: 'identities',
        component: IdentitiesPageComponent,
        data: { breadcrumb: 'Identities'}
      },
      {
        path: 'groups',
        component: GroupsPageComponent,
        data: { breadcrumb: 'Groups'}
      },
      {
        path: 'services',
        component: ServicesPageComponent,
        data: { breadcrumb: 'Services'}
      },
      {
        path: 'organizations',
        component: VosPageComponent,
        data: { breadcrumb: 'Organizations'}
      },
      {
        path: 'privacy',
        component: PrivacyPageComponent,
        data: { breadcrumb: 'Privacy'}
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
        data: { breadcrumb: 'Settings'},
        children: [
          {
            path: '',
            component: SettingsOverviewComponent,
            data: { breadcrumb: 'Settings'}
          },
          {
            path: 'altPasswords',
            component: SettingsAlternativePasswordsComponent,
            data: { breadcrumb: 'Alternative passwords'}
          },
          {
            path: 'dataQuotas',
            component: SettingsDataQuotasComponent,
            data: { breadcrumb: 'Data quotas'}
          },
          {
            path: 'mailingLists',
            component: SettingsMailingListsComponent,
            data: { breadcrumb: 'Mailing lists'}
          },
          {
            path: 'prefShells',
            component: SettingsPreferredShellsComponent,
            data: { breadcrumb: 'Preferred shells'}
          },
          {
            path: 'prefGroupNames',
            component: SettingsPreferredUnixGroupNamesComponent,
            data: { breadcrumb: 'Preferred group names'}
          },
          {
            path: 'sambaPassword',
            component: SettingsSambaPasswordComponent,
            data: { breadcrumb: 'Samba password'}
          },
          {
            path: 'sshKeys',
            component: SettingsSSHKeysComponent,
            data: { breadcrumb: 'SSH keys'}
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled'
    })
  ]
})
export class AppRoutingModule { }
