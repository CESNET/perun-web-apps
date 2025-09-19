import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenuButtonsFieldComponent } from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MenuItem } from '@perun-web-apps/perun/models';
import { FacilitiesManagerService, Facility } from '@perun-web-apps/perun/openapi';
import {
  EntityStorageService,
  GuiAuthResolver,
  RoutePolicyService,
} from '@perun-web-apps/perun/services';

@Component({
  imports: [CommonModule, MenuButtonsFieldComponent, MatProgressSpinnerModule],
  standalone: true,
  selector: 'app-facility-settings-overview',
  templateUrl: './facility-settings-overview.component.html',
  styleUrls: ['./facility-settings-overview.component.scss'],
})
export class FacilitySettingsOverviewComponent implements OnInit {
  @HostBinding('class.router-component') true;

  items: MenuItem[] = [];
  facility: Facility;
  loading = false;

  constructor(
    private facilityManager: FacilitiesManagerService,
    private authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
    private routePolicyService: RoutePolicyService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.facility = this.entityStorageService.getEntity();
    this.initItems();
    this.loading = false;
  }

  private initItems(): void {
    this.items = [];

    // Managers
    if (this.routePolicyService.canNavigate('facilities-settings-managers', this.facility)) {
      this.items.push({
        cssIcon: 'perun-manager',
        url: `/facilities/${this.facility.id}/settings/managers`,
        label: 'MENU_ITEMS.FACILITY.MANAGERS',
        style: 'facility-btn',
      });
    }
    // Bans
    if (this.routePolicyService.canNavigate('facilities-settings-bans', this.facility)) {
      this.items.push({
        cssIcon: 'perun-ban',
        url: `/facilities/${this.facility.id}/settings/bans`,
        label: 'MENU_ITEMS.FACILITY.BANS',
        style: 'facility-btn',
      });
    }
  }
}
