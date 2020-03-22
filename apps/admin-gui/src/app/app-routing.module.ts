import {NgModule} from '@angular/core';
import {NoPreloading, RouterModule, Routes} from '@angular/router';
import {MainMenuPageComponent} from './main-menu-page/main-menu-page.component';
import {AuthCallbackComponent} from './core/components/auth-callback/auth-callback.component';
import {UserProfileComponent} from './shared/components/user-profile/user-profile.component';
import {UserOverviewComponent} from './shared/components/user-detail-page/user-overview/user-overview.component';
import {UserDetailComponent} from './shared/components/user-detail-page/user-detail/user-detail.component';
import {UserOrganizationsComponent} from './shared/components/user-detail-page/user-organizations/user-organizations.component';
import {UserGroupsComponent} from './shared/components/user-detail-page/user-groups/user-groups.component';
import {UserSettingsComponent} from './shared/components/user-detail-page/user-settings/user-settings.component';
import {
  UserSettingsOverviewComponent
} from './shared/components/user-detail-page/user-settings/user-settings-overview/user-settings-overview.component';
import {UserSettingsAttributesComponent} from './shared/components/user-detail-page/user-settings/user-settings-attributes/user-settings-attributes.component';
import { UserRolesComponent } from './shared/components/user-detail-page/user-settings/user-roles/user-roles.component';

const routes: Routes = [
  {
    path: '',
    component: MainMenuPageComponent,
  },
  {
    path: 'api-callback',
    component: AuthCallbackComponent,
  },
  {
    path: 'organizations',
    loadChildren: () => import('./vos/vos.module').then(m => m.VosModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'facilities',
    loadChildren: () => import('./facilities/facilities.module').then(m => m.FacilitiesModule),
  },
  {
    path: ':profile',
    component: UserProfileComponent,
    children: [
      {
        path: '',
        component: UserOverviewComponent,
        data: {animation: 'UserOverviewPage'}
      },
      {
        path: 'detail',
        component: UserDetailComponent,
        data: {animation: 'UserDetailPage'}
      },
      {
        path: 'organizations',
        component: UserOrganizationsComponent,
        data: {animation: 'UserOrganizationsPage'}
      },
      {
        path: 'groups',
        component: UserGroupsComponent,
        data: {animation: 'UserGroupsPage'}
      },
      {
        path: 'settings',
        component: UserSettingsComponent,
        children: [
          {
            path: '',
            component: UserSettingsOverviewComponent,
            data: {animation: 'UserSettingsOverviewPage'}
          },
          {
            path: 'attributes',
            component: UserSettingsAttributesComponent,
            data: {animation: 'UserAttributesPage'}
          },
          {
            path: 'roles',
            component: UserRolesComponent,
            data: {animation: 'UserRolesPage'}
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: NoPreloading,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
