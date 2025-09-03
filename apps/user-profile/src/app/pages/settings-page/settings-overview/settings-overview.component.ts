import { TranslateModule } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { MatNavList, MatListItem } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { TabItem } from '@perun-web-apps/perun/models';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    CustomTranslatePipe,
    MiddleClickRouterLinkDirective,
    RouterModule,
    MatNavList,
    MatListItem,
    MatRipple,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-settings-overview',
  templateUrl: './settings-overview.component.html',
  styleUrls: ['./settings-overview.component.scss'],
})
export class SettingsOverviewComponent implements OnInit {
  items: TabItem[] = [];

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.initItems();
    const displayedTabs: string[] = this.storeService.getProperty('displayed_tabs');
    this.items = this.items.filter((item) => displayedTabs.includes(item.tabName));
  }

  private initItems(): void {
    this.items = [
      {
        icon: 'storage',
        url: `/profile/settings/dataQuotas`,
        label: 'SETTINGS.DATA_QUOTAS',
        tabName: 'data_quotas',
      },
      {
        icon: 'unsubscribe',
        url: `/profile/settings/mailingLists`,
        label: 'SETTINGS.MAILING_LISTS',
        tabName: 'opt_out',
      },
      {
        icon: 'chevron_right',
        url: `/profile/settings/prefShells`,
        label: 'SETTINGS.PREFERRED_SHELLS',
        tabName: 'pref_shells',
      },
      {
        icon: 'group',
        url: `/profile/settings/prefGroupNames`,
        label: 'SETTINGS.PREFERRED_UNIX_GROUP_NAMES',
        tabName: 'pref_group_names',
      },
    ];
  }
}
