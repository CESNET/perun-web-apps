import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacilitiesManagerService, Facility } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-user-settings-facility-attributes',
  templateUrl: './user-settings-facility-attributes.component.html',
  styleUrls: ['./user-settings-facility-attributes.component.scss']
})
export class UserSettingsFacilityAttributesComponent implements OnInit {

  constructor(protected route: ActivatedRoute,
              private storage: StoreService,
              private facilitiesManagerService: FacilitiesManagerService,
              private store: StoreService) {
  }

  userId: number;
  facilities: Facility[] = [];
  loading: boolean;
  showPrincipal: boolean


  ngOnInit(): void {
    this.loading = true;
    if ((this.showPrincipal = this.route.snapshot.data.showPrincipal) === true) {
      this.userId = this.store.getPerunPrincipal().user.id;
    } else {
      this.route.parent.parent.params.subscribe(params => this.userId = params['userId']);
    }

    this.facilitiesManagerService.getAssignedFacilitiesByUser(this.userId).subscribe(facilities => {
      this.facilities = facilities;
      this.loading = false;
    });
  }

}
