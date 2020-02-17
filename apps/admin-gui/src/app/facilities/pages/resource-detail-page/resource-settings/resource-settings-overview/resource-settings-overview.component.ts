import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from '../../../../../shared/models/MenuItem';
import { Resource, ResourcesManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-resource-settings-overview',
  templateUrl: './resource-settings-overview.component.html',
  styleUrls: ['./resource-settings-overview.component.scss']
})
export class ResourceSettingsOverviewComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private route: ActivatedRoute,
    private resourceManager: ResourcesManagerService
  ) { }

  items: MenuItem[] = [];
  resource: Resource;

  ngOnInit() {
    this.route.parent.parent.params.subscribe(parentParams => {
      const resourceId = parentParams['resourceId'];

      this.resourceManager.getResourceById(resourceId).subscribe(resource => {
        this.resource = resource;

        this.initItems();
      });
    });
  }

  private initItems() {
    this.items = [
      {
        cssIcon: 'perun-attributes',
        url: `/facilities/${this.resource.facilityId}/resources/${this.resource.id}/settings/attributes`,
        label: 'MENU_ITEMS.RESOURCE.ATTRIBUTES',
        style: 'resource-btn'
      }
    ];
  }
}
