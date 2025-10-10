import { DataQuotasComponent } from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '@perun-web-apps/perun/openapi';
import { EntityStorageService } from '@perun-web-apps/perun/services';

@Component({
  imports: [CommonModule, DataQuotasComponent],
  standalone: true,
  selector: 'app-perun-web-apps-user-settings-data-quotas',
  templateUrl: './user-settings-data-quotas.component.html',
  styleUrls: ['./user-settings-data-quotas.component.scss'],
})
export class UserSettingsDataQuotasComponent implements OnInit {
  user: User;

  constructor(private entityStorageService: EntityStorageService) {}

  ngOnInit(): void {
    this.user = this.entityStorageService.getEntity();
  }
}
