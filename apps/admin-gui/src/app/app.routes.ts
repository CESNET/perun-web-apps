import { Routes } from '@angular/router';
import { AuthCallbackComponent } from './core/components/auth-callback/auth-callback.component';
import { NotFoundPageComponent } from './shared/components/not-found-page/not-found-page.component';
import { NotAuthorizedPageComponent } from '@perun-web-apps/perun/components';
import {
  LoginScreenComponent,
  LoginScreenServiceAccessComponent,
} from '@perun-web-apps/perun/login';
import { LogoutLoaderComponent } from '@perun-web-apps/ui/loaders';
import { UserDashboardComponent } from './users/pages/user-detail-page/user-dashboard/user-dashboard.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'api-callback',
    component: AuthCallbackComponent,
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
    path: 'organizations',
    loadChildren: () => import('./vos/vos.routes').then((m) => m.vosRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'facilities',
    loadChildren: () => import('./facilities/facilities.routes').then((m) => m.facilitiesRoutes),
  },
  {
    path: 'service-identities',
    loadChildren: () => import('./users/users.routes').then((m) => m.usersRoutes),
  },
  {
    path: 'home',
    component: UserDashboardComponent,
  },
  {
    path: 'notAuthorized',
    component: NotAuthorizedPageComponent,
  },
  { path: '**', component: NotFoundPageComponent },
];
