import { Component } from '@angular/core';
import { NewRegistrarSwitchComponent } from '../new-registrar-switch/new-registrar-switch.component';
import { VoSettingsManageEmbeddedGroupsComponent } from '../../../../vos/pages/vo-detail-page/vo-settings/vo-settings-manage-embedded-groups/vo-settings-manage-embedded-groups.component';
import { GroupSettingsManageEmbeddedGroupsComponent } from '../../../../vos/pages/group-detail-page/group-settings/group-settings-manage-embedded-groups/group-settings-manage-embedded-groups.component';

@Component({
  selector: 'app-application-form-embedded-groups-switch',
  templateUrl: 'application-form-embedded-groups-switch.component.html',
  styleUrls: ['application-form-embedded-groups-switch.component.scss'],
  imports: [NewRegistrarSwitchComponent],
  standalone: true,
})
export class ApplicationFormEmbeddedGroupsSwitchComponent {
  protected readonly VoSettingsManageEmbeddedGroupsComponent =
    VoSettingsManageEmbeddedGroupsComponent;
  protected readonly GroupSettingsManageEmbeddedGroupsComponent =
    GroupSettingsManageEmbeddedGroupsComponent;
}
