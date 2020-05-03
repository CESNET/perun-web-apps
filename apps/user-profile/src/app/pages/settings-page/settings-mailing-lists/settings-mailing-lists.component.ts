import { Component, OnInit } from '@angular/core';
import {
  AttributesManagerService,
  MembersManagerService,
  ResourcesManagerService,
  RichResource,
  User,
  UsersManagerService,
  Vo
} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'perun-web-apps-settings-mailing-lists',
  templateUrl: './settings-mailing-lists.component.html',
  styleUrls: ['./settings-mailing-lists.component.scss']
})
export class SettingsMailingListsComponent implements OnInit {

  constructor(private store: StoreService,
              private usersManagerService: UsersManagerService,
              private membersService: MembersManagerService,
              private resourcesManagerService: ResourcesManagerService,
              private attributesManagerService: AttributesManagerService) {
  }

  user: User;
  vos: Vo[] = [];
  resources: RichResource[] = [];
  mailingLists: string[] = [];

  ngOnInit() {
    this.user = this.store.getPerunPrincipal().user;

    this.usersManagerService.getVosWhereUserIsMember(this.user.id).subscribe(vos => {
      this.vos = vos;
    });
  }

  getMailingLists(vo: Vo) {
    this.membersService.getMemberByUser(vo.id, this.user.id).subscribe(member => {
      this.resourcesManagerService.getAssignedRichResourcesWithMember(member.id).subscribe(resources => {
        this.resources = resources;
        resources.forEach(res => {
          this.getResourceAttributes(member.id, res.id);
        });
      });
    });
  }

  getResourceAttributes(memberId: number, resourceId: number) {
    this.attributesManagerService.getRequiredAttributesMemberResource(memberId, resourceId, true).subscribe(atts => {
      console.log(atts);
      let mailingListAtt = atts.find(att => att.friendlyName === 'optOutMailingList');
      if (mailingListAtt && mailingListAtt.value) {
        // @ts-ignore
        this.mailingLists.push(mailingListAtt.value);
        console.log(mailingListAtt);
      }
    });
  }
}
