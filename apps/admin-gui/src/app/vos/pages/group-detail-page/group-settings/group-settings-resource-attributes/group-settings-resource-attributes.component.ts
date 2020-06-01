import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resource, ResourcesManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-group-settings-resource-attributes',
  templateUrl: './group-settings-resource-attributes.component.html',
  styleUrls: ['./group-settings-resource-attributes.component.scss']
})
export class GroupSettingsResourceAttributesComponent implements OnInit {

  constructor(protected route: ActivatedRoute,
              private resourcesManagerService: ResourcesManagerService) {
  }

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
