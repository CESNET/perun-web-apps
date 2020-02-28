import { Component, HostBinding, OnInit } from '@angular/core';
import { MembersService} from '@perun-web-apps/perun/services';
import { StoreService } from '@perun-web-apps/perun/services';
import { Group, GroupsManagerService, PerunPrincipal, UsersManagerService, Vo } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {

  @HostBinding('class.router-component') true;

  loading = false;
  principal: PerunPrincipal;
  vos: Vo[] = [];
  membersGroups: Group[] = [];
  adminsGroups: Group[] = [];

  constructor(private usersService: UsersManagerService,
              private memberService: MembersService,
              private groupService: GroupsManagerService,
              private store: StoreService) { }

  ngOnInit() {
    this.loading = true;
    this.principal = this.store.getPerunPrincipal();
    this.refreshTable();
  }

  refreshTable() {
    this.loading = true;
    this.membersGroups = [];
    this.usersService.getVosWhereUserIsMember(this.principal.userId).subscribe(vos => {
      this.vos = vos;
      for(const vo of this.vos) {
        this.memberService.getMemberByUser(vo.id, this.principal.userId).subscribe( member => {
          this.groupService.getMemberGroups(member.id).subscribe( groups => {
            this.membersGroups = this.membersGroups.concat(groups);
          });
        });
      }
      this.loading = false;
    });
    this.usersService.getGroupsWhereUserIsAdmin(this.principal.userId).subscribe( groups => {
      this.adminsGroups = groups;
    });
  }
}
