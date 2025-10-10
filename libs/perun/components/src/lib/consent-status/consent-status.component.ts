import { TranslateModule } from '@ngx-translate/core';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [CommonModule, MatIconModule, CustomTranslatePipe, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-consent-status',
  templateUrl: './consent-status.component.html',
  styleUrls: ['./consent-status.component.scss'],
})
export class ConsentStatusComponent {
  @Input() consentStatus: string;
}
