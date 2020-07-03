import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './core/components/auth-callback/auth-callback.component';
import { UserProfileComponent } from './shared/components/user-profile/user-profile.component';
import { UserOrganizationsComponent } from './shared/components/user-detail-page/user-organizations/user-organizations.component';
import { UserGroupsComponent } from './shared/components/user-detail-page/user-groups/user-groups.component';
import { UserSettingsComponent } from './shared/components/user-detail-page/user-settings/user-settings.component';
import { UserSettingsOverviewComponent } from './shared/components/user-detail-page/user-settings/user-settings-overview/user-settings-overview.component';
import { UserSettingsAttributesComponent } from './shared/components/user-detail-page/user-settings/user-settings-attributes/user-settings-attributes.component';
import { UserRolesComponent } from './shared/components/user-detail-page/user-settings/user-roles/user-roles.component';
import { UserSettingsAppConfigurationComponent } from './shared/components/user-detail-page/user-settings/user-settings-app-configuration/user-settings-app-configuration.component';
import { UserDashboardComponent } from './shared/components/user-detail-page/user-dashboard/user-dashboard.component';
import { UserSettingsFacilityAttributesComponent } from './shared/components/user-detail-page/user-settings/user-settings-facility-attributes/user-settings-facility-attributes.component';
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component';
const routes = [
    {
        path: '', redirectTo: '/home', pathMatch: 'full'
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
        path: 'home',
        component: UserProfileComponent,
        children: [
            {
                path: '',
                component: UserDashboardComponent,
                data: { animation: 'UserOverviewPage' }
            },
            {
                path: 'organizations',
                component: UserOrganizationsComponent,
                data: { animation: 'UserOrganizationsPage', showPrincipal: true }
            },
            {
                path: 'groups',
                component: UserGroupsComponent,
                data: { animation: 'UserGroupsPage', showPrincipal: true }
            },
            {
                path: 'settings',
                component: UserSettingsComponent,
                children: [
                    {
                        path: '',
                        component: UserSettingsOverviewComponent,
                        data: { animation: 'UserSettingsOverviewPage' }
                    },
                    {
                        path: 'attributes',
                        component: UserSettingsAttributesComponent,
                        data: { animation: 'UserAttributesPage' }
                    },
                    {
                        path: 'facilityAttributes',
                        component: UserSettingsFacilityAttributesComponent,
                        data: { animation: 'UserSettingsFacilityAttributesPage', showPrincipal: true }
                    },
                    {
                        path: 'roles',
                        component: UserRolesComponent,
                        data: { animation: 'UserRolesPage' }
                    },
                    {
                        path: 'gui-config',
                        component: UserSettingsAppConfigurationComponent,
                        data: { animation: 'UserAppConfigurationPage' }
                    }
                ]
            }
        ]
    },
    { path: '**',
        component: NotFoundPageComponent
    }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes, {
                preloadingStrategy: NoPreloading,
                scrollPositionRestoration: 'enabled'
            })],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map