import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from '../../../../shared/models/MenuItem';
import { FacilitiesManagerService, Facility } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-facility-overview',
  templateUrl: './facility-overview.component.html',
  styleUrls: ['./facility-overview.component.scss']
})
export class FacilityOverviewComponent implements OnInit {

  // class used for animation
  @HostBinding('class.router-component') true;
  navItems: MenuItem[] = [];
  facility: Facility;

  constructor(
    private facilityManager: FacilitiesManagerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const facilityId = params['facilityId'];

      this.facilityManager.getFacilityById(facilityId).subscribe(facility => {
        this.facility = facility;

        this.initItems();
      });
    });
  }

  private initItems() {
    this.navItems = [
      {
        cssIcon: 'perun-manage-facility',
        url: `/facilities/${this.facility.id}/resources`,
        label: 'MENU_ITEMS.FACILITY.RESOURCES',
        style: 'facility-btn'
      },
      {
        cssIcon: 'perun-group',
        url: `/facilities/${this.facility.id}/allowed-groups`,
        label: 'MENU_ITEMS.FACILITY.ALLOWED_GROUPS',
        style: 'facility-btn'
      },
      {
        cssIcon: 'perun-settings2',
        url: `/facilities/${this.facility.id}/settings`,
        label: 'MENU_ITEMS.FACILITY.SETTINGS',
        style: 'facility-btn'
      }
    ];
  }
}
