import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Resource,
  ResourcesManagerService
} from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-member-settings-resource-attributes',
  templateUrl: './member-settings-resource-attributes.component.html',
  styleUrls: ['./member-settings-resource-attributes.component.scss']
})
export class MemberSettingsResourceAttributesComponent implements OnInit {

  constructor(protected route: ActivatedRoute,
              private resourcesManagerService: ResourcesManagerService) {
  }

  memberId: number;
  resources: Resource[] = [];
  loading: boolean;


  ngOnInit(): void {
    this.loading = true;
    this.route.parent.parent.params.subscribe(parent => {
      this.memberId = parent['memberId'];

      this.resourcesManagerService.getAllowedResources(this.memberId).subscribe(resources => {
        this.resources = resources;
        this.loading = false;
      });
    });
  }
}
