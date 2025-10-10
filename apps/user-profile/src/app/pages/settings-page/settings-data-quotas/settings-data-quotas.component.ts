import { DataQuotasComponent } from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  imports: [CommonModule, DataQuotasComponent],
  standalone: true,
  selector: 'perun-web-apps-settings-data-quotas',
  templateUrl: './settings-data-quotas.component.html',
  styleUrls: ['./settings-data-quotas.component.scss'],
})
export class SettingsDataQuotasComponent implements OnInit {
  user: User;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.user = this.store.getPerunPrincipal().user;
  }
}
