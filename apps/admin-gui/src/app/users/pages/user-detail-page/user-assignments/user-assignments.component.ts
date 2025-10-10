import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { TwoEntityAttributePageComponent } from '../../../../shared/components/two-entity-attribute-page/two-entity-attribute-page.component';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FacilitiesManagerService,
  Facility,
  Member,
  Resource,
  ResourcesManagerService,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { compareFnName } from '@perun-web-apps/perun/utils';
import { FacilitySearchSelectComponent } from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { ResourcesListComponent } from '@perun-web-apps/perun/components';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    UiAlertsModule,
    TwoEntityAttributePageComponent,
    MatTabsModule,
    MatProgressSpinnerModule,
    TranslateModule,
    FacilitySearchSelectComponent,
    LoaderDirective,
    ResourcesListComponent,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-perun-web-apps-user-assignments',
  templateUrl: './user-assignments.component.html',
  styleUrls: ['./user-assignments.component.scss'],
})
export class UserAssignmentsComponent implements OnInit {
  initLoading = true;
  loading = false;
  facilities: Facility[] = [];
  selectedFacility: Facility = null;
  member: Member = null;
  resources: Resource[] = [];
  userId: number;
  constructor(
    private route: ActivatedRoute,
    private facilityService: FacilitiesManagerService,
    private usersService: UsersManagerService,
    private resourcesService: ResourcesManagerService,
  ) {}

  ngOnInit(): void {
    this.initLoading = true;
    this.route.parent.params.subscribe((params) => {
      this.userId = Number(params['userId']);
      this.facilityService.getAssignedFacilitiesByUser(this.userId).subscribe({
        next: (facilities) => {
          this.facilities = facilities;
          if (this.facilities.length) {
            this.loadFacility(this.facilities.sort(compareFnName)[0]);
          }
          this.initLoading = false;
        },
        error: () => (this.initLoading = false),
      });
    });
  }

  loadFacility(facility: Facility): void {
    this.loading = true;
    this.selectedFacility = facility;
    this.usersService
      .getAssociatedResourcesForUser(this.selectedFacility.id, this.userId)
      .subscribe({
        next: (resources) => {
          this.resourcesService
            .getRichResourcesByIds(resources.map((resource) => resource.id))
            .subscribe({
              next: (richResources) => {
                this.resources = richResources;
                this.loading = false;
              },
              error: () => (this.loading = false),
            });
        },
        error: () => (this.loading = false),
      });
  }
}
