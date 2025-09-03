import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Group } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MiddleClickRouterLinkDirective,
    RouterModule,
    TranslateModule,
    MatTooltip,
  ],
  standalone: true,
  selector: 'perun-web-apps-authorized-groups-cell',
  templateUrl: 'authorized-groups-cell.component.html',
  styleUrls: ['authorized-groups-cell.component.scss'],
})
export class AuthorizedGroupsCellComponent {
  @Input() groups: Group[];
  @Input() authzVoNames: Map<number, string>;
  @Input() disableRouting = false;
  defaultItemsShown = 3;
  itemsShown = this.defaultItemsShown;
  showMore = false;
  onShowChange(): void {
    this.showMore = !this.showMore;

    this.setItemsShown();
  }

  private setItemsShown(): void {
    if (this.showMore) {
      this.itemsShown = this.groups.length;
    } else {
      this.itemsShown = this.defaultItemsShown;
    }
  }
}
