import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule, MatIconModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-focus-on-mfa-window',
  templateUrl: './focus-on-mfa-window.component.html',
  styleUrls: ['./focus-on-mfa-window.component.scss'],
})
export class FocusOnMfaWindowComponent {}
