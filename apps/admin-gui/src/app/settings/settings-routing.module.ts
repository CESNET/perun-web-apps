import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SettingsComponent } from './pages/settings.component';
import { RouteAuthGuardService } from '../shared/route-auth-guard.service';
import { SettingsOverviewComponent } from './pages/settings-overview/settings-overview.component';
import { GuiConfigurationComponent } from './pages/gui-configuration/gui-configuration.component';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
