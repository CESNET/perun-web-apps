import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FacilitiesManagerService,
  Facility,
  Group,
  Resource,
  ResourcesManagerService, Service, ServicesManagerService, Vo
} from '@perun-web-apps/perun/openapi';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ServiceSelectValue } from '@perun-web-apps/perun/facility-services-config';


@Component({
  selector: 'app-facility-service-config',
  templateUrl: './facility-service-config.component.html',
  styleUrls: ['./facility-service-config.component.scss']
})
export class FacilityServiceConfigComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private facilityManager: FacilitiesManagerService,
    private resourceManager: ResourcesManagerService,
    private serviceManager: ServicesManagerService
  ) { }

  facility: Facility;
  serviceId: number;

  services: Service[];
  resources: Resource[];
  groups: Group[];
  vos: Vo[];

  selectedService: Service | ServiceSelectValue = 'NOT_SELECTED';
  selectedResource: Resource;
  selectedGroup: Group;
  selectedVo: Vo;

  ngOnInit() {
    this.route.parent.params.subscribe(parentParams => {
      const facilityId = parentParams['facilityId'];

      this.facilityManager.getFacilityById(facilityId).subscribe(facility => {
        this.facility = facility;

        this.facilityManager.getAssignedResourcesForFacility(facility.id)
          .subscribe(resources => this.resources = resources);

        this.serviceManager.getAssignedServices(facility.id).subscribe(services => this.services = services);
      });
    });
  }

  onSelectedResource() {
    if (this.selectedResource !== undefined) {
      this.resourceManager.getAssignedGroups(this.selectedResource.id).subscribe(groups => this.groups = groups);
      this.selectedGroup = undefined;
    }
  }

  onOfferAllServices(event: MatCheckboxChange) {
    if (!event.checked) {
      this.serviceManager.getAssignedServices(this.facility.id).subscribe(services => this.services = services);
    }
  }
}
