import { Component, OnInit } from '@angular/core';
import { MembersManagerService, PerunPrincipal, UsersManagerService, Vo } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'perun-web-apps-vos-page',
  templateUrl: './vos-page.component.html',
  styleUrls: ['./vos-page.component.scss']
})
export class VosPageComponent implements OnInit {

  constructor(
    private usersService: UsersManagerService,
    private store: StoreService,
    private membersService: MembersManagerService
  ) {
  }

  principal: PerunPrincipal;
  vosWhereIsAdmin: Vo[];
  vosWhereIsMember: Vo[];
  loading: boolean;
  userId: number;
  filterValue = '';
  selection = new SelectionModel<Vo>(false, []);
  selectionAdmin = new SelectionModel<Vo>(false, []);
  displayedColumns = ['checkbox','id', 'name'];

  ngOnInit() {
    this.principal = this.store.getPerunPrincipal();
    this.userId = this.principal.user.id;

    this.refreshTable();
  }

  refreshTable() {
    this.loading = true;
    this.usersService.getVosWhereUserIsMember(this.userId).subscribe(vosMember => {
      this.vosWhereIsMember = vosMember;

      this.vosWhereIsMember.forEach(vo =>{
        this.membersService.getMemberByUser(vo.id, this.userId).subscribe(member =>{
          this.membersService.getRichMemberWithAttributes(member.id).subscribe(richMember =>{
            console.log(richMember);
          })
        })
      });

      this.usersService.getVosWhereUserIsAdmin(this.userId).subscribe(vosAdmin => {
        this.vosWhereIsAdmin = vosAdmin;
        this.loading = false;
      });
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }


}
