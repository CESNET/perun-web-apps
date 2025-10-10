import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type AlertType = 'error' | 'warn' | 'info' | 'success';

@Component({
  imports: [CommonModule, MatIconModule],
  standalone: true,
  selector: 'perun-web-apps-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() alert_type: AlertType;
}
