import { Component, OnInit } from '@angular/core';
import {
  BanOnFacility,
  FacilitiesManagerService,
  Facility,
  User,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { TABLE_FACILITY_BLACKLIST_LIST } from '@perun-web-apps/config/table-config';
import { SelectionModel } from '@angular/cdk/collections';
import { EntityStorageService } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-perun-web-apps-facility-settings-blacklist',
  templateUrl: './facility-settings-blacklist.component.html',
  styleUrls: ['./facility-settings-blacklist.component.scss'],
})
export class FacilitySettingsBlacklistComponent implements OnInit {
  bansOnFacilitiesWithUsers: [BanOnFacility, User][] = [];
  selected = new SelectionModel<[BanOnFacility, User]>(
    true,
    [],
    true,
    ([ban1, user1], [ban2, user2]) => ban1.id === ban2.id && user1.id === user2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  filterValue = '';
  loading: boolean;
  tableId = TABLE_FACILITY_BLACKLIST_LIST;
  facility: Facility;

  constructor(
    private facilitiesManager: FacilitiesManagerService,
    private usersManager: UsersManagerService,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.facility = this.entityStorageService.getEntity();
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.facilitiesManager.getBansForFacility(this.facility.id).subscribe((bansOnFacility) => {
      const listOfBans: BanOnFacility[] = bansOnFacility;
      for (const ban of listOfBans) {
        let user: User;
        this.usersManager.getUserById(ban.userId).subscribe((subscriptionUser) => {
          user = subscriptionUser;
        });
        this.bansOnFacilitiesWithUsers.push([ban, user]);
      }
      this.selected.clear();
      this.cachedSubject.next(true);
      this.loading = false;
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }
}
