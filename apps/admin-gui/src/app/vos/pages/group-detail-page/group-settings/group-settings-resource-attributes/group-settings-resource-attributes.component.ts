import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resource, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { AttributesListComponent } from '@perun-web-apps/perun/components';

@Component({
  selector: 'perun-web-apps-group-settings-resource-attributes',
  templateUrl: './group-settings-resource-attributes.component.html',
  styleUrls: ['./group-settings-resource-attributes.component.scss']
})
export class GroupSettingsResourceAttributesComponent implements OnInit {

  constructor(protected route: ActivatedRoute,
              private resourcesManagerService: ResourcesManagerService) {
  }

  @ViewChild('list')
  list: AttributesListComponent;

  groupId: number;
  resources: Resource[] = [];
  loading: boolean;


  ngOnInit(): void {
    this.loading = true;
    this.route.parent.parent.params.subscribe(parent => {
      this.groupId = parent['groupId'];
      console.log(this.groupId);
      this.resourcesManagerService.getAssignedResourcesWithGroup(this.groupId).subscribe(resources => {
        this.resources = resources;
        this.loading = false;
      });
    });
  }
}
