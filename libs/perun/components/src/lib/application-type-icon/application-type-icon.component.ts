import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [CommonModule, MatIconModule, MatTooltip],
  standalone: true,
  selector: 'perun-web-apps-application-type-icon',
  templateUrl: './application-type-icon.component.html',
  styleUrls: ['./application-type-icon.component.css'],
})
export class ApplicationTypeIconComponent {
  @Input()
  applicationType: string;
}
