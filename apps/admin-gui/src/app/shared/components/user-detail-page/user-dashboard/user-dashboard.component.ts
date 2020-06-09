import { Component, HostBinding, OnInit } from '@angular/core';
import {
  FacilitiesManagerService,
  Facility,
  Group,
  User,
  UsersManagerService,
  Vo
} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import {
  TABLE_USER_PROFILE_DASHBOARD_FACILITY,
  TABLE_USER_PROFILE_DASHBOARD_GROUP,
  TABLE_USER_PROFILE_DASHBOARD_VO,
  TableConfigService
} from '@perun-web-apps/config/table-config';
import { MenuItem } from '@perun-web-apps/perun/models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-perun-web-apps-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(private userManager: UsersManagerService,
              private storeService: StoreService,
              private tableConfigService: TableConfigService,
              private facilitiesService: FacilitiesManagerService) { }

  navItems: MenuItem[] = [];
  user: User;
  path: string;

  adminVo: Vo[] = [];
  voTableId = TABLE_USER_PROFILE_DASHBOARD_VO;
  voPageSize: number;
  voFilterValue = '';

  adminGroup: Group[] = [];
  groupTableId = TABLE_USER_PROFILE_DASHBOARD_GROUP;
  groupPageSize: number;
  groupFilterValue = '';

  adminFacility: Facility[] = [];
  facilityTableId = TABLE_USER_PROFILE_DASHBOARD_FACILITY;
  facilityPageSize: number;
  facilityFilterValue = '';

  ngOnInit() {
    this.user = this.storeService.getPerunPrincipal().user;
    this.voPageSize = this.tableConfigService.getTablePageSize(this.voTableId);
    this.groupPageSize = this.tableConfigService.getTablePageSize(this.groupTableId);
    this.facilityPageSize = this.tableConfigService.getTablePageSize(this.facilityTableId);
    this.getAdminVoGroup();
  }

  getAdminVoGroup() {
    this.userManager.getVosWhereUserIsAdmin(this.user.id).subscribe( vo => {
      this.adminVo = vo;
      this.userManager.getGroupsWhereUserIsAdmin(this.user.id).subscribe( groups => {
        this.adminGroup = groups;
        this.getAdminFacility();
      });
    });
  }

  getAdminFacility() {
    this.facilitiesService.getAllFacilities().subscribe(facilities => {
      this.adminFacility = facilities;
    });
  }

  pageChanged($event: PageEvent, tableId: string, pagesize: number) {
    pagesize = $event.pageSize;
    this.tableConfigService.setTablePageSize(tableId, pagesize);
  }
}
