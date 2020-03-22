import { Component, HostBinding, OnInit } from '@angular/core';
import { AuthzResolverService, PerunPrincipal } from '@perun-web-apps/perun/openapi';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {

  @HostBinding('class.router-component') true;
  private currentIds: any[] = [];

  constructor(private authzResolverService: AuthzResolverService,
              private route: ActivatedRoute,
              private store: StoreService) {
  }

  roles: Map<string, Map<string, Array<number>>> = new Map<string, Map<string, Array<number>>>();
  principal: PerunPrincipal;

  roleNames: string[];

  ngOnInit() {
    this.route.parent.parent.params.subscribe(params => {
      let userId: number;
      if (params['profile']) {
        this.principal = this.store.getPerunPrincipal();
        userId = this.principal.userId;
      } else {
        userId = params['userId'];
      }

      this.authzResolverService.getUserRoleNames(userId).subscribe(roleNames => {
        this.roleNames = roleNames.map(elem => elem.toUpperCase());

        this.authzResolverService.getUserRoles(userId).subscribe(roles => {
          this.roleNames.forEach(roleName => {
            const innerMap = new Map<string, Array<number>>();
            const innerRoles = Object.keys(roles[roleName]);

            innerRoles.forEach(innerRole => {
              innerMap.set(innerRole, roles[roleName][innerRole]);
            });

            this.roles.set(roleName, innerMap);
          });
        });
      });
    });

  }

  getInnerKeys(role: string) {
    if (this.roles.get(role)) {
      const it = this.roles.get(role).entries();
      const result = [];
      let val = it.next().value;
      while (val) {
        result.push(val);
        val = it.next().value;
      }
      this.currentIds = result;
    } else {
      this.currentIds = [];
    }
  }
}
