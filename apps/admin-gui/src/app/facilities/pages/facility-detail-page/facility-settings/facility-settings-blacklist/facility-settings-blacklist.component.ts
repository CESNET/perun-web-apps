import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  BanOnFacility,
  FacilitiesManagerService,
  Facility,
  User,
  UsersManagerService
} from '@perun-web-apps/perun/openapi';
import { TABLE_FACILITY_BLACKLIST_LIST, TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-perun-web-apps-facility-settings-blacklist',
  templateUrl: './facility-settings-blacklist.component.html',
  styleUrls: ['./facility-settings-blacklist.component.scss']
})
export class FacilitySettingsBlacklistComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private facilitiesManager: FacilitiesManagerService,
              private usersManager: UsersManagerService,
              private tableConfigService: TableConfigService,
              private route: ActivatedRoute) {
  }

  facility: Facility;
  bansOnFacilitiesWithUsers: [BanOnFacility, User][] = [];
  selected = new SelectionModel<[BanOnFacility, User]>(true, []);
  filterValue = '';
  loading: boolean;
  pageSize: number;
  tableId = TABLE_FACILITY_BLACKLIST_LIST;


  ngOnInit(): void {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);

    this.route.parent.parent.params.subscribe(parentParentParams => {
      const facilityId = parentParentParams['facilityId'];
      this.facilitiesManager.getFacilityById(facilityId).subscribe(facility => {
        this.facility = facility;

        this.refreshTable();
      });
    });
  }

  refreshTable() {
    this.loading = true;
    this.facilitiesManager.getBansForFacility(this.facility.id).subscribe(bansOnFacility => {
      const listOfBans: BanOnFacility[] = bansOnFacility;
      for (const ban of listOfBans) {
        let user: User;
        this.usersManager.getUserById(ban.userId).subscribe(subscriptionUser => {
          user = subscriptionUser;
        });
        this.bansOnFacilitiesWithUsers.push([ban, user]);
      }
      this.selected.clear();
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
