import { Component, HostBinding } from '@angular/core';
import { MenuItem } from '@perun-web-apps/perun/models';
import { MenuButtonsFieldComponent } from '@perun-web-apps/perun/components';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './settings-overview.component.html',
  styleUrls: ['./settings-overview.component.scss'],
  imports: [MenuButtonsFieldComponent],
})
export class SettingsOverviewComponent {
  @HostBinding('class.router-component') true;

  items: MenuItem[] = [
    {
      cssIcon: 'perun-settings1',
      url: '/settings/gui_config',
      label: 'MENU_ITEMS.SETTINGS.GUI_CONFIG',
      style: 'service-btn',
    },
  ];
}
