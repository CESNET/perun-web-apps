import { Component } from '@angular/core';
import { GroupApplicationsComponent } from '../../../../vos/pages/group-detail-page/group-applications/group-applications.component';
import { VoApplicationsComponent } from '../../../../vos/pages/vo-detail-page/vo-applications/vo-applications.component';
import { NewRegistrarSwitchComponent } from '../new-registrar-switch/new-registrar-switch.component';
import { VoApplicationsNewRegComponent } from '../../../../vos/pages/vo-detail-page/vo-applications-new-reg/vo-applications-new-reg.component';
import { GroupApplicationsNewRegComponent } from '../../../../vos/pages/group-detail-page/group-applications-new-reg/group-applications-new-reg.component';

@Component({
  selector: 'app-applications-page-switch',
  imports: [NewRegistrarSwitchComponent],
  templateUrl: 'applications-page-switch.component.html',
  standalone: true,
})
export class ApplicationsPageSwitchComponent {
  protected readonly VoApplicationsComponent = VoApplicationsComponent;
  protected readonly VoApplicationsNewRegComponent = VoApplicationsNewRegComponent;
  protected readonly GroupApplicationsComponent = GroupApplicationsComponent;
  protected readonly GroupApplicationsNewRegComponent = GroupApplicationsNewRegComponent;
}
