import { Component } from '@angular/core';
import { NewRegistrarSwitchComponent } from '../new-registrar-switch/new-registrar-switch.component';
import { MemberApplicationsComponent } from '../../../../vos/pages/member-detail-page/member-applications/member-applications.component';
import { MemberApplicationsNewRegComponent } from '../../../../vos/pages/member-detail-page/member-applications-new-reg/member-applications-new-reg.component';

@Component({
  selector: 'app-member-applications-switch',
  templateUrl: 'member-applications-switch.component.html',
  styleUrls: ['member-applications-switch.component.scss'],
  standalone: true,
  imports: [NewRegistrarSwitchComponent],
})
export class MemberApplicationsSwitchComponent {
  protected readonly MemberApplicationsComponent = MemberApplicationsComponent;
  protected readonly MemberApplicationsNewRegComponent = MemberApplicationsNewRegComponent;
}
