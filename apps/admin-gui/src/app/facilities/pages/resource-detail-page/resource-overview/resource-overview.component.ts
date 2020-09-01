import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from '@perun-web-apps/perun/models';
import { Resource, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';

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
    public guiAuthResolver:GuiAuthResolver
  ) {
  }

  navItems: MenuItem[] = [];
  resource: Resource;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const resourceId = params['resourceId'];

      this.resourcesManager.getResourceById(resourceId).subscribe(resource => {
        this.resource = resource;

        if (this.route.parent.parent.snapshot.url[0].path === 'facilities') {
          this.initItems(false);
        } else {
          this.initItems(true);
        }
      });
    });
  }

  private initItems(inVo: boolean) {
    const urlStart = inVo ? `/organizations/${this.resource.voId}` : `/facilities/${this.resource.facilityId}`;
    this.navItems = [];
    if(this.guiAuthResolver.isAuthorized('getAssignedGroups_Resource_policy', [this.resource])){
      this.navItems.push({
        cssIcon: 'perun-group',
        url: `${urlStart}/resources/${this.resource.id}/groups`,
        label: 'MENU_ITEMS.RESOURCE.ASSIGNED_GROUPS',
        style: 'resource-btn'
      })
    }
    if(this.guiAuthResolver.isAuthorized('getAssignedServices_Resource_policy', [this.resource])){
      this.navItems.push({
        cssIcon: 'perun-service',
        url: `/${urlStart}/resources/${this.resource.id}/services`,
        label: 'MENU_ITEMS.RESOURCE.ASSIGNED_SERVICES',
        style: 'resource-btn'
      });
    }
   this.navItems.push({
     cssIcon: 'perun-settings2',
     url: `${urlStart}/resources/${this.resource.id}/settings`,
     label: 'MENU_ITEMS.RESOURCE.SETTINGS',
     style: 'resource-btn'
   });
  }
}
