import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Attribute, AttributesManagerService, Facility, Group, Resource, Service } from '@perun-web-apps/perun/openapi';

export type ServiceSelectValue = 'ALL' | 'NOT_SELECTED';

@Component({
  selector: 'perun-web-apps-service-configurator',
  templateUrl: './service-configurator.component.html',
  styleUrls: ['./service-configurator.component.scss']
})
export class ServiceConfiguratorComponent implements OnInit, OnChanges {

  constructor(
    private attributesManager: AttributesManagerService
  ) { }

  @Input()
  facility: Facility;

  @Input()
  service: Service | ServiceSelectValue;

  @Input()
  resource: Resource;

  @Input()
  group: Group;

  showTab = 0;

  facilityAttributes: Attribute[];
  resourceAttributes: Attribute[];
  groupAttributes: Attribute[];

  ngOnInit() {
    this.loadFacilityAttributes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['service']) {
      this.reloadAll();
      return;
    }
    if (changes['resource']) {
      if (changes['resource'].currentValue === undefined) {
        this.resourceAttributes = undefined;
        this.showTab = 0;
      } else {
        this.showTab = 1;
        this.loadResourceAttributes()
      }
    } else if (changes['group']) {
      if (changes['group'].currentValue === undefined) {
        this.groupAttributes = undefined;
        this.showTab = 1;
      } else {
        this.showTab = 2;
        this.attributesManager.getGroupAttributes(this.group.id).subscribe(attrs => this.groupAttributes = attrs);
      }
    }
  }

  loadResourceAttributes() {
    if (this.service === 'NOT_SELECTED') {
      this.attributesManager
        .getResourceAttributes(this.resource.id)
        .subscribe(attrs => this.resourceAttributes = attrs);
    } else if (this.service === 'ALL') {
      this.attributesManager
        .getRequiredAttributesResource(this.resource.id)
        .subscribe(attrs => this.resourceAttributes = attrs);
    } else {
      this.attributesManager
        .getRequiredAttributesResourceService(this.service.id, this.resource.id)
        .subscribe(attrs => this.resourceAttributes = attrs);
    }
  }

  loadFacilityAttributes() {
    if (this.service === 'NOT_SELECTED') {
      this.attributesManager
        .getFacilityAttributes(this.facility.id)
        .subscribe(attrs => this.facilityAttributes = attrs);
    } else if (this.service === 'ALL') {
      this.attributesManager
        .getRequiredAttributesFacility(this.facility.id)
        .subscribe(attrs => this.facilityAttributes = attrs);
    } else {
      this.attributesManager
        .getRequiredAttributesFacilityService(this.service.id, this.facility.id)
        .subscribe(attrs => this.facilityAttributes = attrs);
    }
  }

  private reloadAll() {
    this.loadFacilityAttributes();
    if (this.resource !== undefined) {
      this.loadResourceAttributes();
    }
  }
}
