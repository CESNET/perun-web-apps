import { Component, OnInit } from '@angular/core';
import { SideMenuService } from '../../core/services/common/side-menu.service';
import { PerunPrincipal, User } from '@perun-web-apps/perun/openapi';
import { SharedModule } from '../../shared/shared.module';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [MatIcon, SharedModule, PerunSharedComponentsModule, CommonModule, TranslateModule],
})
export class SettingsComponent implements OnInit {
  principal: PerunPrincipal;
  user: User;
  path: string;

  constructor(private sideMenuService: SideMenuService) {}

  ngOnInit(): void {
    this.sideMenuService.setSettingsItems([]);
  }
}
