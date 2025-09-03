import { AnimatedRouterOutletComponent } from '../../../shared/components/animated-router-outlet/animated-router-outlet.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { fadeIn } from '@perun-web-apps/perun/animations';

@Component({
  imports: [CommonModule, AnimatedRouterOutletComponent],
  standalone: true,
  selector: 'app-user-detail-page',
  templateUrl: './user-detail-page.component.html',
  styleUrls: ['./user-detail-page.component.scss'],
  animations: [fadeIn],
})
export class UserDetailPageComponent {}
