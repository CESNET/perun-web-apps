import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {fadeIn} from '@perun-web-apps/perun/animations';
import {SideMenuService} from '../../../core/services/common/side-menu.service';
import {SideMenuItemService} from '../../../shared/side-menu/side-menu-item.service';
import { FacilitiesManagerService, Resource, ResourcesManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-resource-detail-page',
  templateUrl: './resource-detail-page.component.html',
  styleUrls: ['./resource-detail-page.component.scss'],
  animations: [
    fadeIn
  ]
})
export class ResourceDetailPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private facilityManager: FacilitiesManagerService,
    private resourcesManager: ResourcesManagerService,
    private sideMenuService: SideMenuService,
    private sideMenuItemService: SideMenuItemService
  ) { }

  resource: Resource;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const resourceId = params['resourceId'];

      this.resourcesManager.getResourceById(resourceId).subscribe(resource => {
        this.resource = resource;

        this.facilityManager.getFacilityById(resource.facilityId).subscribe(facility => {
          const facilityItem = this.sideMenuItemService.parseFacility(facility);
          const resourceItem = this.sideMenuItemService.parseResource(resource);

          this.sideMenuService.setFacilityMenuItems([facilityItem, resourceItem]);
        });
      });
    });
  }
}
