import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  imports: [CommonModule, UiAlertsModule],
  standalone: true,
  selector: 'perun-web-apps-invalid-request-alert',
  templateUrl: './invalid-request-alert.component.html',
  styleUrls: ['./invalid-request-alert.component.scss'],
})
export class InvalidRequestAlertComponent implements OnInit {
  invalidRequestMessage: string;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.invalidRequestMessage = this.translate.instant(
      'PAGES.PWD_RESET_PAGE.INVALID_REQUEST',
    ) as string;
    this.translate.onLangChange.subscribe(() => {
      this.invalidRequestMessage = this.translate.instant(
        'PAGES.PWD_RESET_PAGE.INVALID_REQUEST',
      ) as string;
    });
  }
}
