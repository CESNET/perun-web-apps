import { MailingListsComponent } from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '@perun-web-apps/perun/openapi';
import { EntityStorageService } from '@perun-web-apps/perun/services';

@Component({
  imports: [CommonModule, MailingListsComponent],
  standalone: true,
  selector: 'app-perun-web-apps-user-settings-mailing-lists',
  templateUrl: './user-settings-mailing-lists.component.html',
  styleUrls: ['./user-settings-mailing-lists.component.scss'],
})
export class UserSettingsMailingListsComponent implements OnInit {
  user: User;

  constructor(private entityStorageService: EntityStorageService) {}

  ngOnInit(): void {
    this.user = this.entityStorageService.getEntity();
  }
}
