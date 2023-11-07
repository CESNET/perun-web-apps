import { Component, HostBinding, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import {
  Group,
  GroupsManagerService,
  MembersManagerService,
  UsersManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';
import {
  TABLE_USER_DETAIL_ADMIN_GROUPS,
  TABLE_USER_DETAIL_MEMBER_GROUPS,
} from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss'],
})
export class UserGroupsComponent implements OnInit {
  @HostBinding('class.router-component') true;

  memberRefresh: boolean;
  adminRefresh: boolean;
  memberFilterValue = '';
  adminFilterValue = '';

  vos: Vo[] = [];
  membersGroups: Group[] = [];
  adminsGroups: Group[] = [];
  userId: number;

  tableId = TABLE_USER_DETAIL_MEMBER_GROUPS;

  adminTableId = TABLE_USER_DETAIL_ADMIN_GROUPS;
  showPrincipal: boolean;

  constructor(
    private usersService: UsersManagerService,
    private memberService: MembersManagerService,
    private groupService: GroupsManagerService,
    private store: StoreService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if ((this.showPrincipal = this.route.snapshot.data.showPrincipal as boolean)) {
      this.userId = this.store.getPerunPrincipal().user.id;
    } else {
      this.route.parent.params.subscribe((params) => (this.userId = Number(params['userId'])));
    }
    this.refreshAdminTable();
    this.refreshMemberTable();
  }

  memberFilter(filterValue: string): void {
    this.memberFilterValue = filterValue;
  }

  adminFilter(filterValue: string): void {
    this.adminFilterValue = filterValue;
  }

  refreshAdminTable(): void {
    this.adminRefresh = true;
    this.usersService.getGroupsWhereUserIsAdmin(this.userId).subscribe((groups) => {
      this.adminsGroups = groups;
      this.adminRefresh = false;
    });
  }

  refreshMemberTable(): void {
    this.memberRefresh = true;
    this.membersGroups = [];
    this.usersService.getVosWhereUserIsMember(this.userId).subscribe((vos) => {
      this.vos = vos;
      for (const vo of this.vos) {
        this.memberService.getMemberByUser(vo.id, this.userId).subscribe((member) => {
          this.groupService.getMemberGroups(member.id).subscribe((groups) => {
            this.membersGroups = this.membersGroups.concat(groups);
            if (this.vos.indexOf(vo) === this.vos.length - 1) {
              this.memberRefresh = false;
            }
          });
        });
      }
      if (vos.length === 0) {
        this.memberRefresh = false;
      }
    });
  }
}
