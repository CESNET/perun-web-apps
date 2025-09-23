import { Component, OnInit } from '@angular/core';
import { AuthzResolverService, Group, PerunPrincipal } from '@perun-web-apps/perun/openapi';
import { RoleService, StoreService } from '@perun-web-apps/perun/services';
import { RolesPanelsComponent } from '../../components/roles-list/roles-panels.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';

@Component({
  selector: 'perun-web-apps-roles-page',
  templateUrl: './roles-page.component.html',
  styleUrls: ['./roles-page.component.scss'],
  imports: [RolesPanelsComponent, TranslateModule, CustomTranslatePipe],
})
export class RolesPageComponent implements OnInit {
  principal: PerunPrincipal;
  loading: boolean;
  userId: number;
  roles = new Map<string, Map<string, number[]>>();
  indirectRoles = new Map<string, Map<string, number[]>>();
  rolesComplementaryObjectsWithAuthzGroups = new Map<string, Map<string, Map<number, Group[]>>>();
  outerLoading: boolean;

  constructor(
    private authzResolverService: AuthzResolverService,
    private store: StoreService,
    private roleService: RoleService,
  ) {}

  ngOnInit(): void {
    this.outerLoading = true;
    this.principal = this.store.getPerunPrincipal();
    this.userId = this.principal.user.id;
    this.getData();
  }

  getData(): void {
    this.outerLoading = true;

    // get user based roles
    this.roles.clear();
    this.authzResolverService.getUserDirectRoles(this.userId).subscribe({
      next: (roles) => {
        // prepare direct roles
        const roleNames = Object.keys(roles).map((role) => role.toUpperCase());
        this.roles = this.roleService.prepareRoles(roles, roleNames, false);

        // get group based roles
        this.indirectRoles.clear();
        this.authzResolverService
          .getUserRolesObtainedFromAuthorizedGroupMemberships(this.userId)
          .subscribe({
            next: (groupBasedRoles) => {
              // prepare group based roles
              const groupBasedRoleNames = Object.keys(groupBasedRoles).map((role) =>
                role.toUpperCase(),
              );
              this.indirectRoles = this.roleService.prepareRoles(
                groupBasedRoles,
                groupBasedRoleNames,
                false,
              );

              // get map of roles and complementary objects with authorized groups
              this.rolesComplementaryObjectsWithAuthzGroups.clear();
              this.authzResolverService
                .getRoleComplementaryObjectsWithAuthorizedGroups(this.userId)
                .subscribe({
                  next: (obtainedComplementaryObjects) => {
                    // prepare map
                    this.rolesComplementaryObjectsWithAuthzGroups =
                      this.roleService.prepareComplementaryObjects(
                        Object.keys(obtainedComplementaryObjects),
                        obtainedComplementaryObjects,
                      );
                    this.outerLoading = false;
                  },
                  error: () => (this.outerLoading = false),
                });
            },
            error: () => (this.outerLoading = false),
          });
      },
      error: () => (this.outerLoading = false),
    });
  }
}
