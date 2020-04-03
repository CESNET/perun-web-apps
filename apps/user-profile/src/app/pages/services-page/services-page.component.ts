import { Component, OnInit } from '@angular/core';
import {
  MembersManagerService,
  ResourcesManagerService,
  RichResource,
  UsersManagerService,
  Vo
} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'perun-web-apps-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss']
})
export class ServicesPageComponent implements OnInit {

  constructor(private usersManagerService: UsersManagerService,
              private membersManagerService: MembersManagerService,
              private resourcesManagerService: ResourcesManagerService,
              private storage: StoreService) { }

  vos: Vo[];
  userId: number;
  resources: RichResource[] = [];

  hiddenColumns: string[] = ['select', 'id', 'facility', 'tags'];

  ngOnInit() {
    this.userId = this.storage.getPerunPrincipal().userId;
    this.usersManagerService.getVosWhereUserIsMember(this.userId).subscribe(vos => {
      this.vos = vos;
    });
  }

  getMemberData(vo: Vo) {
    this.membersManagerService.getMemberByUser(vo.id, this.userId).subscribe(member =>{
      this.resourcesManagerService.getAssignedRichResourcesWithMember(member.id).subscribe(resources =>{
        this.resources = resources;
      })
    })
  }
}
