import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OneEntityAttributePageComponent } from '../../../../shared/components/one-entity-attribute-page/one-entity-attribute-page.component';
import { TwoEntityAttributePageComponent } from '../../../../shared/components/two-entity-attribute-page/two-entity-attribute-page.component';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { Resource, ResourcesManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [
    CommonModule,
    OneEntityAttributePageComponent,
    TwoEntityAttributePageComponent,
    MatTabsModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'app-resource-attributes',
  templateUrl: './resource-attributes.component.html',
  styleUrls: ['./resource-attributes.component.scss'],
})
export class ResourceAttributesComponent implements OnInit {
  @HostBinding('class.router-component') true;

  resource: Resource;

  resourceGroupAttAuth: boolean;
  resourceMemberAttAuth: boolean;

  constructor(
    private authResolver: GuiAuthResolver,
    private resourceManager: ResourcesManagerService,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.resource = this.entityStorageService.getEntity();
    this.resourceGroupAttAuth = this.authResolver.isAuthorized(
      'getGroupAssignments_Resource_policy',
      [this.resource],
    );
    this.resourceMemberAttAuth = this.authResolver.isAuthorized(
      'getAssignedMembersWithStatus_Resource_policy',
      [this.resource],
    );
  }
}
