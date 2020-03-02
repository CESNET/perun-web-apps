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

const routes: Routes = [
  {
    path: 'profile',
    component: ProfilePageComponent
  },
  {
    path: 'identities',
    component: IdentitiesPageComponent
  },
  {
    path: 'groups',
    component: GroupsPageComponent
  },
  {
    path: 'services',
    component: ServicesPageComponent
  },
  {
    path: 'organizations',
    component: VosPageComponent
  },
  {
    path: 'privacy',
    component: PrivacyPageComponent
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    children: [
      {
        path: '',
        component: SettingsOverviewComponent
      },
      {
        path: 'altPasswords',
        component: SettingsAlternativePasswordsComponent
      },
      {
        path: 'dataQuotas',
        component: SettingsDataQuotasComponent
      },
      {
        path: 'mailingLists',
        component: SettingsMailingListsComponent
      },
      {
        path: 'prefShells',
        component: SettingsPreferredShellsComponent
      },
      {
        path: 'prefGroupNames',
        component: SettingsPreferredUnixGroupNamesComponent
      },
      {
        path: 'sambaPassword',
        component: SettingsSambaPasswordComponent
      },
      {
        path: 'sshKeys',
        component: SettingsSSHKeysComponent
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
