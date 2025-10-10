import { AnimatedRouterOutletComponent } from '../../../../../../shared/components/animated-router-outlet/animated-router-outlet.component';
import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';

@Component({
  imports: [CommonModule, AnimatedRouterOutletComponent],
  standalone: true,
  selector: 'app-service-identity-authentication',
  templateUrl: './service-identity-authentication.component.html',
  styleUrls: ['./service-identity-authentication.component.scss'],
})
export class ServiceIdentityAuthenticationComponent {
  @HostBinding('class.router-component') true;
}
