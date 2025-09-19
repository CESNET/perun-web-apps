import { AnimatedRouterOutletComponent } from '../../../../shared/components/animated-router-outlet/animated-router-outlet.component';
import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';

@Component({
  imports: [CommonModule, AnimatedRouterOutletComponent],
  standalone: true,
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent {
  @HostBinding('class.router-component') true;
}
