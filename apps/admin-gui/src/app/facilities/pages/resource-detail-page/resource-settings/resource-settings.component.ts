import { AnimatedRouterOutletComponent } from '../../../../shared/components/animated-router-outlet/animated-router-outlet.component';
import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { fadeIn } from '@perun-web-apps/perun/animations';

@Component({
  imports: [CommonModule, AnimatedRouterOutletComponent],
  standalone: true,
  selector: 'app-resource-settings',
  templateUrl: './resource-settings.component.html',
  styleUrls: ['./resource-settings.component.scss'],
  animations: [fadeIn],
})
export class ResourceSettingsComponent {
  @HostBinding('class.router-component') true;
}
