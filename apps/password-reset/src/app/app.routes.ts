import { Routes } from '@angular/router';
import {
  LoginScreenComponent,
  LoginScreenServiceAccessComponent,
} from '@perun-web-apps/perun/login';

export const appRoutes: Routes = [
  {
    path: 'service-access',
    component: LoginScreenServiceAccessComponent,
  },
  {
    path: 'login',
    component: LoginScreenComponent,
  },
];
