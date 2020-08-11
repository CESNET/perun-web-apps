import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from '@perun-web-apps/perun/models';
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
        cssIcon: 'perun-status',
        url: `/facilities/${this.facility.id}/services-status`,
        label: 'MENU_ITEMS.FACILITY.SERVICES_STATUS',
        style: 'facility-btn'
      },
      {
        cssIcon: 'perun-settings2',
        url: `/facilities/${this.facility.id}/service-config`,
        label: 'MENU_ITEMS.FACILITY.SERVICE_CONFIG',
        style: 'facility-btn'
      },
      {
        cssIcon: 'perun-service_destination',
        url: `/facilities/${this.facility.id}/services-destinations`,
        label: 'MENU_ITEMS.FACILITY.SERVICES_DESTINATIONS',
        style: 'facility-btn'
      },
      {
        cssIcon: 'perun-hosts',
        url: `/facilities/${this.facility.id}/hosts`,
        label: 'MENU_ITEMS.FACILITY.HOSTS',
        style: 'facility-btn'
      },
      {
        cssIcon: 'perun-security-teams',
        url: `/facilities/${this.facility.id}/security-teams`,
        label: 'MENU_ITEMS.FACILITY.SECURITY_TEAMS',
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
