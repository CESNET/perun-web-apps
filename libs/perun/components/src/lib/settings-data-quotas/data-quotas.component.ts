import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { DebounceFilterComponent } from '../debounce-filter/debounce-filter.component';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AttributesManagerService,
  MembersManagerService,
  ResourcesManagerService,
  RichResource,
  User,
  UsersManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { RequestChangeDataQuotaDialogComponent } from '@perun-web-apps/perun/dialogs';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    UiAlertsModule,
    CustomTranslatePipe,
    DebounceFilterComponent,
    MatExpansionModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-data-quotas',
  templateUrl: './data-quotas.component.html',
  styleUrls: ['./data-quotas.component.scss'],
})
export class DataQuotasComponent implements OnInit {
  @Input() user: User;
  vos: Vo[] = [];
  resources: RichResource[] = [];
  currentQuota: string;
  defaultQuota: string;
  quotasMarkup = '';
  filteredVos: Vo[] = [];
  loading: boolean;

  constructor(
    private usersManagerService: UsersManagerService,
    private membersService: MembersManagerService,
    private resourcesManagerService: ResourcesManagerService,
    private attributesManagerService: AttributesManagerService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.usersManagerService.getVosWhereUserIsMember(this.user.id).subscribe((vos) => {
      this.vos = vos;
      this.filteredVos = vos;
    });
  }

  getMembersResources(vo: Vo): void {
    this.loading = true;
    this.resources = [];
    this.membersService.getMemberByUser(vo.id, this.user.id).subscribe((member) => {
      this.resourcesManagerService
        .getAssignedRichResourcesWithMember(member.id)
        .subscribe((resources) => {
          let count = resources.length;
          if (!count) {
            this.loading = false;
          }
          resources.forEach((resource) => {
            this.attributesManagerService
              .getResourceAttributes(resource.id)
              .subscribe((resAtts) => {
                count--;
                if (resAtts.find((att) => att.friendlyName === 'defaultDataQuotas')) {
                  this.resources.push(resource);
                }
                this.loading = count !== 0;
              });
          });
        });
    });
  }

  getResAttributes(id: number): void {
    this.attributesManagerService.getResourceAttributes(id).subscribe((atts) => {
      let quotaAttribute = atts.find((att) => att.friendlyName === 'dataQuotas');
      if (quotaAttribute?.value) {
        const values = Object.entries(quotaAttribute.value as { [s: string]: string }).map(
          (entry) => String(entry[1]),
        );
        this.currentQuota = values[0];
      } else {
        this.currentQuota = '';
      }
      quotaAttribute = atts.find((att) => att.friendlyName === 'defaultDataQuotas');
      if (quotaAttribute?.value) {
        const values = Object.entries(quotaAttribute.value as { [s: string]: string }).map(
          (entry) => String(entry[1]),
        );
        this.defaultQuota = values[0];
      } else {
        this.defaultQuota = '';
      }
      if (!this.currentQuota) {
        this.currentQuota = this.defaultQuota;
      }
      this.parseMarkup();
    });
  }

  requestChangeQuota(vo: Vo, resource: RichResource): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = { vo: vo, resource: resource, user: this.user, currentQuota: this.quotasMarkup };

    this.dialog.open(RequestChangeDataQuotaDialogComponent, config);
  }

  applyFilter(filter: string): void {
    this.filteredVos = this.vos.filter((vo) =>
      vo.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  private parseMarkup(): void {
    let result = '';
    result += this.currentQuota;
    result += ` (default: ${this.defaultQuota})`;
    result = result
      .split(':')
      .join(' : ')
      .split('K')
      .join(' KiB')
      .split('M')
      .join(' MiB')
      .split('G')
      .join(' GiB')
      .split('T')
      .join(' TiB')
      .split('E')
      .join(' EiB');

    this.quotasMarkup = result;
  }
}
