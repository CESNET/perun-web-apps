import { Component } from '@angular/core';
import { NewRegistrarSwitchComponent } from '../new-registrar-switch/new-registrar-switch.component';
import { VoSettingsApplicationFormComponent } from '../../../../vos/pages/vo-detail-page/vo-settings/vo-settings-application-form/vo-settings-application-form.component';
import { GroupSettingsApplicationFormComponent } from '../../../../vos/pages/group-detail-page/group-settings/group-settings-application-form/group-settings-application-form.component';
import { VoSettingsApplicationFormNewRegComponent } from '../../../../vos/pages/vo-detail-page/vo-settings/vo-settings-application-form-new-reg/vo-settings-application-form-new-reg.component';
import { GroupSettingsApplicationFormNewRegComponent } from '../../../../vos/pages/group-detail-page/group-settings/group-settings-application-form-new-reg/group-settings-application-form-new-reg.component';

@Component({
  selector: 'app-settings-application-form-switch',
  templateUrl: 'settings-application-form-switch.component.html',
  styleUrls: ['settings-application-form-switch.component.scss'],
  standalone: true,
  imports: [NewRegistrarSwitchComponent],
})
export class SettingsApplicationFormSwitchComponent {
  protected readonly VoSettingsApplicationFormComponent = VoSettingsApplicationFormComponent;
  protected readonly VoSettingsApplicationFormNewRegComponent =
    VoSettingsApplicationFormNewRegComponent;
  protected readonly GroupSettingsApplicationFormComponent = GroupSettingsApplicationFormComponent;
  protected readonly GroupSettingsApplicationFormNewRegComponent =
    GroupSettingsApplicationFormNewRegComponent;
}
