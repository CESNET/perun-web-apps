import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { fadeIn } from '@perun-web-apps/perun/animations';

@Component({
  imports: [CommonModule, RouterModule],
  standalone: true,
  selector: 'app-animated-router-outlet',
  templateUrl: './animated-router-outlet.component.html',
  styleUrls: ['./animated-router-outlet.component.scss'],
  animations: [fadeIn],
})
export class AnimatedRouterOutletComponent {
  prepareRoute(outlet: RouterOutlet): boolean {
    return outlet?.activatedRouteData && outlet?.activatedRouteData['animation'] !== null;
  }
}
