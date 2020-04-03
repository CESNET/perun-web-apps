import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from '../../../../../../../../libs/perun/models/src/lib/MenuItem';
import { Resource, ResourcesManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-resource-overview',
  templateUrl: './resource-overview.component.html',
  styleUrls: ['./resource-overview.component.scss']
})
export class ResourceOverviewComponent implements OnInit {

  // class used for animation
  @HostBinding('class.router-component') true;

  constructor(
    private resourcesManager: ResourcesManagerService,
    private route: ActivatedRoute,
  ) { }

  navItems: MenuItem[] = [];
  resource: Resource;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const resourceId = params['resourceId'];

      this.resourcesManager.getResourceById(resourceId).subscribe(resource => {
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
