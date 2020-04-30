import { Component, OnInit } from '@angular/core';
import { PerunPrincipal, UsersManagerService, Vo } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'perun-web-apps-vos-page',
  templateUrl: './vos-page.component.html',
  styleUrls: ['./vos-page.component.scss']
})
export class VosPageComponent implements OnInit {

  constructor(
    private usersService: UsersManagerService,
    private store: StoreService
  ) {
  }

  principal: PerunPrincipal;
  vosWhereIsAdmin: Vo[];
  vosWhereIsMember: Vo[];
  loading: boolean;
  userId: number;
  filterValue = '';

  displayedColumns = ['id', 'name'];

  ngOnInit() {
    this.principal = this.store.getPerunPrincipal();
    this.userId = this.principal.user.id;

    this.refreshTable();
  }

  refreshTable() {
    this.loading = true;
    this.usersService.getVosWhereUserIsMember(this.userId).subscribe(vosMember => {
      this.vosWhereIsMember = vosMember;

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
