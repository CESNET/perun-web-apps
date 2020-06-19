import {Component, HostBinding, OnInit} from '@angular/core';
import {MenuItem} from '@perun-web-apps/perun/models';
import {ActivatedRoute} from '@angular/router';
import { FacilitiesManagerService, Facility } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-facility-settings-overview',
  templateUrl: './facility-settings-overview.component.html',
  styleUrls: ['./facility-settings-overview.component.scss']
})
export class FacilitySettingsOverviewComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private route: ActivatedRoute,
    private facilityManager: FacilitiesManagerService
  ) { }

  items: MenuItem[] = [];
  facility: Facility;

  ngOnInit() {
    this.route.parent.parent.params.subscribe(parentParams => {
      const facilityId = parentParams['facilityId'];

      this.facilityManager.getFacilityById(facilityId).subscribe(facility => {
        this.facility = facility;

        this.initItems();
      });
    });
  }

  private initItems() {
    this.items = [
      {
        cssIcon: 'perun-attributes',
        url: `/facilities/${this.facility.id}/settings/attributes`,
        label: 'MENU_ITEMS.FACILITY.ATTRIBUTES',
        style: 'facility-btn'
      },
      {
        cssIcon: 'perun-user',
        url: `/facilities/${this.facility.id}/settings/owners`,
        label: 'MENU_ITEMS.FACILITY.OWNERS',
        style: 'facility-btn'
      },
      {
        cssIcon: 'perun-manager',
        url: `/facilities/${this.facility.id}/settings/managers`,
        label: 'MENU_ITEMS.FACILITY.MANAGERS',
        style: 'facility-btn'
      },
      {
        cssIcon: 'perun-user',
        url: `/facilities/${this.facility.id}/settings/blacklist`,
        label: 'MENU_ITEMS.FACILITY.BLACKLIST',
        style: 'facility-btn'
      }
    ];
  }
}
