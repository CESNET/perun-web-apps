import { TranslateModule } from '@ngx-translate/core';
import { AnimatedRouterOutletComponent } from '../../../shared/components/animated-router-outlet/animated-router-outlet.component';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    PerunSharedComponentsModule,
    AnimatedRouterOutletComponent,
    TranslateModule,
  ],
  standalone: true,
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  constructor(private sideMenuService: SideMenuService) {}

  ngOnInit(): void {
    this.sideMenuService.setAdminItems([]);
  }
}
