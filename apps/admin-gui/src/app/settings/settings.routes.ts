import { Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings.component';
import { RouteAuthGuardService } from '../shared/route-auth-guard.service';
import { SettingsOverviewComponent } from './pages/settings-overview/settings-overview.component';
import { GuiConfigurationComponent } from './pages/gui-configuration/gui-configuration.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    canActivateChild: [RouteAuthGuardService],
    children: [
      {
        path: '',
        component: SettingsOverviewComponent,
        data: { animation: 'SettingsOverview' },
      },
      {
        path: 'gui_config',
        component: GuiConfigurationComponent,
        data: { animation: 'GuiConfiguration' },
      },
    ],
  },
];
