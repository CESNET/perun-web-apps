import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, MatTooltip],
  standalone: true,
  selector: 'perun-web-apps-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent implements OnInit {
  backButtonColor: string;

  constructor(
    private location: Location,
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    this.backButtonColor = this.storeService.getProperty('theme').back_button_color;
  }

  goBack(): void {
    if (sessionStorage.getItem('onInitPage') === 'false') {
      this.location.back();
    }
  }
}
