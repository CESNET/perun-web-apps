import { AnimatedRouterOutletComponent } from '../../../../shared/components/animated-router-outlet/animated-router-outlet.component';
import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { fadeIn } from '@perun-web-apps/perun/animations';

@Component({
  imports: [CommonModule, AnimatedRouterOutletComponent],
  standalone: true,
  selector: 'app-facility-settings',
  templateUrl: './facility-settings.component.html',
  styleUrls: ['./facility-settings.component.scss'],
  animations: [fadeIn],
})
export class FacilitySettingsComponent {
  @HostBinding('class.router-component') true;
}
