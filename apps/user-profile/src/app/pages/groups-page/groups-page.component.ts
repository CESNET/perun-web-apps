import { Component, OnInit } from '@angular/core';
import { AuthzService, MembersService, UsersService } from '@perun-web-apps/perun/services';
import {
  Group,
  GroupsManagerService,
  MembersManagerService,
  PerunPrincipal,
  UsersManagerService, Vo
} from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent implements OnInit {

  // constructor() {
  // }
  loading = false;
  principal: PerunPrincipal;
  vos: Vo[] = [];
  membersGroups: Group[] = [];
  adminsGroups: Group[] = [];

  constructor(private usersService: UsersManagerService,
              private memberService: MembersManagerService,
              private groupService: GroupsManagerService,
              // private authzService:AuthzService
  ) { }

  ngOnInit() {
    // this.loading = true;
    // this.authzService.getPerunPrincipal().subscribe(principal =>{
    //   this.principal = principal;
    //   console.log(principal);
    //   // this.refreshTable();
    // });
    this.usersService.getUserById(73916).subscribe(user =>{
      console.log(user);
    })
  }

  // refreshTable() {
  //   this.loading = true;
  //   this.membersGroups = [];
  //   this.usersService.getVosWhereUserIsMember(this.principal.userId).subscribe(vos => {
  //     this.vos = vos;
  //     for(const vo of this.vos) {
  //       this.memberService.getMemberByUser(vo.id, this.principal.userId).subscribe( member => {
  //         this.groupService.getMemberGroups(member.id).subscribe( groups => {
  //           this.membersGroups = this.membersGroups.concat(groups);
  //         });
  //       });
  //     }
  //     this.loading = false;
  //   });
  //   this.usersService.getGroupsWhereUserIsAdmin(this.principal.userId).subscribe( groups => {
  //     this.adminsGroups = groups;
  //   });
  // }

}
