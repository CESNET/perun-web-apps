import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeIn } from '@perun-web-apps/perun/animations';

@Component({
  selector: 'app-animated-router-outlet',
  templateUrl: './animated-router-outlet.component.html',
  styleUrls: ['./animated-router-outlet.component.scss'],
  animations: [fadeIn],
})
export class AnimatedRouterOutletComponent {
  constructor() {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
