import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [CommonModule, MatIconModule, TranslateModule, MatTooltip],
  standalone: true,
  selector: 'perun-web-apps-recently-viewed-icon',
  templateUrl: './recently-viewed-icon.component.html',
  styleUrls: ['./recently-viewed-icon.component.css'],
})
export class RecentlyViewedIconComponent {
  @Input() recentIds: number[] = [];
  @Input() id: number;
}
