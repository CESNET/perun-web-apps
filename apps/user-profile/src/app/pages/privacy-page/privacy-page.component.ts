import { Component, OnInit } from '@angular/core';
import {
  Attribute,
  AttributesManagerService,
  MembersManagerService, RichUser,
  UsersManagerService,
  Vo
} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';

@Component({
  selector: 'perun-web-apps-privacy-page',
  templateUrl: './privacy-page.component.html',
  styleUrls: ['./privacy-page.component.scss']
})
export class PrivacyPageComponent implements OnInit {

  constructor(private usersManagerService:UsersManagerService,
              private membersService:MembersManagerService,
              private attributesManagerService: AttributesManagerService,
              private storage: StoreService) { }

  vos: Vo[] = [];
  userId: number;
  user: RichUser;
  attributes: Attribute[] = [];
  username = '';
  hiddenColumns = ['select', 'id'];

  ngOnInit() {
    this.userId = this.storage.getPerunPrincipal().userId;
    this.usersManagerService.getVosWhereUserIsMember(this.userId).subscribe(vos => {
      this.vos = vos;
    });
  }

  getUserData() {
    this.usersManagerService.getRichUserWithAttributes(this.userId).subscribe(user => {
      this.user = user;
      this.attributes = user.userAttributes;
      this.username = new UserFullNamePipe().transform(user);
    });
  }

  getMemberData(vo: Vo) {
    this.membersService.getMemberByUser(vo.id, this.userId).subscribe(member =>{
      this.membersService.getRichMemberWithAttributes(member.id).subscribe(richMember =>{
        this.attributes = richMember.memberAttributes;
      });
    });
  }
}
