import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SideMenuService } from '../core/services/common/side-menu.service';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { MatRipple } from '@angular/material/core';

@Component({
  imports: [CommonModule, MatIconModule, RouterModule, TranslateModule, MatRipple],
  standalone: true,
  selector: 'app-main-menu-page',
  templateUrl: './main-menu-page.component.html',
  styleUrls: ['./main-menu-page.component.scss'],
})
export class MainMenuPageComponent implements OnInit {
  constructor(
    private sideMenuService: SideMenuService,
    public authResolver: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.sideMenuService.reset();
  }
}
