import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OneEntityAttributePageComponent } from '../../../../shared/components/one-entity-attribute-page/one-entity-attribute-page.component';
import { TwoEntityAttributePageComponent } from '../../../../shared/components/two-entity-attribute-page/two-entity-attribute-page.component';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { Facility } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [
    CommonModule,
    OneEntityAttributePageComponent,
    TwoEntityAttributePageComponent,
    MatTabsModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'app-facility-attributes',
  templateUrl: './facility-attributes.component.html',
  styleUrls: ['./facility-attributes.component.scss'],
})
export class FacilityAttributesComponent implements OnInit {
  @HostBinding('class.router-component') true;

  facility: Facility;
  facilityUserAttAuth: boolean;

  constructor(
    private authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.facility = this.entityStorageService.getEntity();
    this.facilityUserAttAuth = this.authResolver.isAuthorized('getAssignedUsers_Facility_policy', [
      this.facility,
    ]);
  }
}
