import { Routes } from '@angular/router';
import { LoginScreenComponent } from '@perun-web-apps/perun/login';
import { MainWindowComponent } from './components/main-window/main-window.component';
import { ShowResultPageComponent } from './components/show-result-page/show-result-page.component';
import { LogoutLoaderComponent } from '@perun-web-apps/ui/loaders';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'consolidate',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginScreenComponent,
  },
  {
    path: 'logout',
    component: LogoutLoaderComponent,
  },
  {
    path: 'consolidate',
    component: MainWindowComponent,
  },
  {
    path: 'result/:result',
    component: ShowResultPageComponent,
  },
];
