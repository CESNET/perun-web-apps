import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from '../../../../shared/models/MenuItem';
import { ResourcesService } from '@perun-web-apps/perun/services';
import { Resource } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-resource-overview',
  templateUrl: './resource-overview.component.html',
  styleUrls: ['./resource-overview.component.scss']
})
export class ResourceOverviewComponent implements OnInit {

  // class used for animation
  @HostBinding('class.router-component') true;

  constructor(
    private resourcesService: ResourcesService,
    private route: ActivatedRoute,
  ) { }

  navItems: MenuItem[] = [];
  resource: Resource;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const resourceId = params['resourceId'];

      this.resourcesService.getResourceById(resourceId).subscribe(resource => {
        this.resource = resource;

        this.initItems();
      });
    });
  }

  private initItems() {
    this.navItems = [
      {
        cssIcon: 'perun-group',
        url: `/facilities/${this.resource.facilityId}/resources/${this.resource.id}/groups`,
        label: 'MENU_ITEMS.RESOURCE.ASSIGNED_GROUPS',
        style: 'resource-btn'
      },
      {
        cssIcon: 'perun-settings2',
        url: `/facilities/${this.resource.facilityId}/resources/${this.resource.id}/settings`,
        label: 'MENU_ITEMS.RESOURCE.SETTINGS',
        style: 'resource-btn'
      }
    ];
  }
}
