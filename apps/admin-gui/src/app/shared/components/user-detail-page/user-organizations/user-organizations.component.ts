import { Component, HostBinding, OnInit } from '@angular/core';
import { UsersService } from '@perun-web-apps/perun/services';
import { PerunPrincipal, Vo } from '@perun-web-apps/perun/models';
import { AuthResolverService } from '../../../../core/services/common/auth-resolver.service';
import { StoreService } from '../../../../core/services/common/store.service';

@Component({
  selector: 'app-user-organizations',
  templateUrl: './user-organizations.component.html',
  styleUrls: ['./user-organizations.component.scss']
})
export class UserOrganizationsComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private usersService: UsersService,
    private authResolver: AuthResolverService,
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
