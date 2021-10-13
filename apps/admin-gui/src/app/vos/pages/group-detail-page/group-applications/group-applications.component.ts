import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Application,
  Group,
  GroupsManagerService,
  RegistrarManagerService
} from '@perun-web-apps/perun/openapi';
import {
  TABLE_GROUP_APPLICATIONS_DETAILED,
  TABLE_GROUP_APPLICATIONS_NORMAL
} from '@perun-web-apps/config/table-config';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-group-applications',
  templateUrl: './group-applications.component.html',
  styleUrls: ['./group-applications.component.scss']
})
export class GroupApplicationsComponent implements OnInit {

  static id = 'GroupApplicationsComponent';

  // used for router animation
  @HostBinding('class.router-component') true;

  constructor(private groupService: GroupsManagerService,
              private registrarManager: RegistrarManagerService,
              protected route: ActivatedRoute,
              private guiAuthResolver: GuiAuthResolver) { }

  state = 'pending';
  loading = false;
  applications: Application[] = [];
  group: Group;
  displayedColumns: string[] = ['id', 'createdAt', 'type', 'state', 'user', 'modifiedBy'];
  filterValue = '';
  showAllDetails = false;
  detailTableId = TABLE_GROUP_APPLICATIONS_DETAILED;
  tableId = TABLE_GROUP_APPLICATIONS_NORMAL;
  routeAuth = false;

  startDate: FormControl;
  endDate: FormControl;

  ngOnInit() {
    this.loading = true;
    this.route.parent.params.subscribe(parentParams => {
      const groupId = parentParams['groupId'];
      this.groupService.getGroupById(groupId).subscribe( group => {
        this.group = group;
        this.setData(['NEW', 'VERIFIED']);
      });
      this.startDate = new FormControl(formatDate(this.yearAgo(),'yyyy-MM-dd','en-GB'));
      this.endDate =new FormControl(formatDate(new Date(),'yyyy-MM-dd','en-GB'));
    });
  }

  setAuth() {
    if (this.applications.length !== 0) {
      this.routeAuth = this.guiAuthResolver.isAuthorized('group-getApplicationById_int_policy', [this.group]);
    }
  }


  setData(state: string[]) {
    this.registrarManager.getApplicationsForGroup(this.group.id, state, formatDate(this.startDate.value, 'yyyy-MM-dd','en-GB'), formatDate(this.endDate.value, 'yyyy-MM-dd','en-GB')).subscribe(applications => {
      this.applications = applications;
      this.setAuth();
      this.loading = false;
    });
  }

  select() {
    this.loading = true;
    switch (this.state) {
      case 'approved': {
        this.setData(['APPROVED']);
        break;
      }
      case 'rejected': {
        this.setData(['REJECTED']);
        break;
      }
      case 'wfmv': {
        this.setData(['NEW']);
        break;
      }
      case 'submited': {
        this.setData(['VERIFIED']);
        break;
      }
      case 'pending': {
        this.setData(['NEW', 'VERIFIED']);
        break;
      }
      case 'all': {
        this.setData(null);
        break;
      }
      default: {
        break;
      }
    }
  }

  yearAgo() {
    const date = new Date();
    const year = date.getFullYear() - 1;
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day);
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }
}
