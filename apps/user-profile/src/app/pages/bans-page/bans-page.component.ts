import { Component, OnInit } from '@angular/core';
import {
  EnrichedBanOnFacility,
  EnrichedBanOnResource,
  EnrichedBanOnVo,
  FacilitiesManagerService,
  PerunPrincipal,
  ResourcesManagerService,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import {
  BanOnEntityListColumn,
  BanOnEntityListComponent,
  DebounceFilterComponent,
} from '@perun-web-apps/perun/components';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  selector: 'perun-web-apps-bans-page',
  templateUrl: './bans-page.component.html',
  styleUrls: ['./bans-page.component.scss'],
  imports: [
    CustomTranslatePipe,
    TranslateModule,
    BanOnEntityListComponent,
    DebounceFilterComponent,
    LoadingTableComponent,
    LoaderDirective,
  ],
})
export class BansPageComponent implements OnInit {
  principal: PerunPrincipal;
  loading: boolean;
  userId: number;
  filterValue = '';
  displayedColumns: BanOnEntityListColumn[] = ['targetName', 'description', 'expiration'];

  voBans: EnrichedBanOnVo[] = [];
  resourceBans: EnrichedBanOnResource[] = [];
  facilityBans: EnrichedBanOnFacility[] = [];

  constructor(
    private resourceService: ResourcesManagerService,
    private facilityService: FacilitiesManagerService,
    private voService: VosManagerService,
    private store: StoreService,
  ) {}

  ngOnInit(): void {
    this.principal = this.store.getPerunPrincipal();
    this.userId = this.principal.user.id;

    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.resourceService.getEnrichedBansForUser(this.userId).subscribe((resBans) => {
      this.resourceBans = resBans;
      this.facilityService.getEnricheFacilitydBansForUser(this.userId).subscribe((facilityBans) => {
        this.facilityBans = facilityBans;
        this.voService.getEnrichedVoBansForUser(this.userId).subscribe((voBans) => {
          this.voBans = voBans;
          this.loading = false;
        });
      });
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }
}
