import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AddManagerDialogComponent } from '../dialogs/add-manager-dialog/add-manager-dialog.component';
import { RemoveManagerDialogComponent } from '../dialogs/remove-manager-dialog/remove-manager-dialog.component';
import { RemoveGroupManagerDialogComponent } from '../dialogs/remove-group-manager-dialog/remove-group-manager-dialog.component';
import { AddGroupManagerDialogComponent } from '../dialogs/add-group-manager-dialog/add-group-manager-dialog.component';
import {
  AuthzResolverService,
  Group,
  PerunBean,
  RichUser,
  RoleManagementRules,
} from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { TABLE_GROUP_MANAGERS_PAGE } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, StoreService } from '@perun-web-apps/perun/services';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ReloadEntityDetailService } from '../../../core/services/common/reload-entity-detail.service';
import { AuthPrivilege } from '@perun-web-apps/perun/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { userTableColumn } from '@perun-web-apps/perun/components';

@Component({
  selector: 'app-managers-page',
  templateUrl: './managers-page.component.html',
  styleUrls: ['./managers-page.component.scss'],
})
export class ManagersPageComponent implements OnInit {
  @HostBinding('class.router-component') true;
  @Input() complementaryObject: PerunBean;
  @Input() availableRoles: RoleManagementRules[];
  @Input() complementaryObjectType: string;
  @Input() theme: string;
  @Input() configMode = false;
  @Input() disableRouting = false;
  @Input() disableSelf = false;
  @Input() displayedUserColumns: userTableColumn[] = [
    'select',
    'id',
    'name',
    'email',
    'logins',
    'organization',
  ];
  @Input() displayedGroupColumns = ['select', 'id', 'vo', 'name', 'description'];

  groups: Group[] = [];
  managers: RichUser[] = [];
  managers$: Observable<Array<RichUser>> = null;
  selectionUsers = new SelectionModel<RichUser>(
    true,
    [],
    true,
    (user1, user2) => user1.id === user2.id,
  );
  selectionGroups = new SelectionModel<Group>(
    true,
    [],
    true,
    (group1, group2) => group1.id === group2.id,
  );
  selectedMode = '';
  selectedRole: string;
  showIndirectAdmins = false;
  directAdminsIds: number[] = null;
  loading = false;
  tableId = TABLE_GROUP_MANAGERS_PAGE;
  routeAuth: boolean;
  manageAuth: boolean;
  roleModes: string[];
  availableRolesPrivileges = new Map<string, AuthPrivilege>();
  cacheSubject = new BehaviorSubject(true);

  constructor(
    private dialog: MatDialog,
    private authzService: AuthzResolverService,
    private storeService: StoreService,
    public guiAuthResolver: GuiAuthResolver,
    private router: Router,
    private reloadEntityDetail: ReloadEntityDetailService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.routeAuth = this.guiAuthResolver.isPerunAdminOrObserver();

    this.guiAuthResolver.setRolesAuthorization(
      this.availableRoles,
      this.complementaryObject,
      this.availableRolesPrivileges,
    );
    this.availableRoles = this.availableRoles.filter(
      (role) => this.availableRolesPrivileges.get(role.roleName).readAuth,
    );

    if (this.availableRoles.length !== 0) {
      this.selectedRole = this.availableRoles[0].roleName;
    }
    this.refreshUsers();
  }

  changeRolePrivileges(): void {
    this.guiAuthResolver.setRolesAuthorization(
      this.availableRoles,
      this.complementaryObject,
      this.availableRolesPrivileges,
    );
    this.availableRoles = this.availableRoles.filter(
      (role) => this.availableRolesPrivileges.get(role.roleName).readAuth,
    );

    this.manageAuth = this.availableRolesPrivileges.get(this.selectedRole).manageAuth;
    this.displayedUserColumns = this.manageAuth
      ? this.displayedUserColumns
      : this.displayedUserColumns.filter((col) => col !== 'select');
    this.displayedGroupColumns = this.manageAuth
      ? this.displayedGroupColumns
      : this.displayedGroupColumns.filter((col) => col !== 'select');
    this.roleModes = this.availableRolesPrivileges.get(this.selectedRole).modes;
    let roleHasThisMode = false;
    for (const mode of this.roleModes) {
      if (this.selectedMode === mode.toLowerCase()) {
        roleHasThisMode = true;
        break;
      }
    }
    if (!roleHasThisMode) {
      this.selectedMode = this.roleModes[0].toLowerCase();
    }
  }

  tabChanged(event: MatTabChangeEvent): void {
    this.loading = true;

    if (event.index === 0) {
      this.selectedMode = 'user';
      this.refreshUsers();
    } else {
      this.selectedMode = 'group';
      this.refreshGroups();
    }
  }

  refreshUsers(refreshDirectAdmins = false): void {
    this.loading = true;
    this.changeRolePrivileges();

    let attributes = [Urns.USER_DEF_ORGANIZATION, Urns.USER_DEF_PREFERRED_MAIL];
    attributes = attributes.concat(this.storeService.getLoginAttributeNames());

    if (this.showIndirectAdmins) {
      if (refreshDirectAdmins) {
        this.managers$ = this.getDirectAdmins(attributes).pipe(
          mergeMap(() => this.getIndirectAdmins(attributes)),
        );
      } else {
        this.managers$ = this.getIndirectAdmins(attributes);
      }
    } else {
      this.managers$ = this.getDirectAdmins(attributes);
    }

    this.managers$.subscribe({
      next: (managers) => {
        this.managers = managers;
        this.selectionUsers.clear();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    this.cacheSubject.next(true);
    this.selectionUsers.clear();
  }

  getDirectAdmins(attributes: string[]): Observable<Array<RichUser>> {
    return this.authzService
      .getAuthzRichAdmins(
        this.selectedRole,
        this.complementaryObject.id,
        this.complementaryObjectType,
        attributes,
        false,
        true,
      )
      .pipe(tap((managers) => (this.directAdminsIds = managers.map((manager) => manager.id))));
  }

  getIndirectAdmins(attributes: string[]): Observable<Array<RichUser>> {
    this.loading = true;
    return this.authzService.getAuthzRichAdmins(
      this.selectedRole,
      this.complementaryObject.id,
      this.complementaryObjectType,
      attributes,
      false,
      false,
    );
  }

  refreshGroups(): void {
    this.loading = true;
    this.changeRolePrivileges();

    this.authzService
      .getAuthzAdminGroups(
        this.selectedRole,
        this.complementaryObject.id,
        this.complementaryObjectType,
      )
      .subscribe({
        next: (groups) => {
          this.groups = groups;
          this.selectionGroups.clear();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });

    this.cacheSubject.next(true);
    this.selectionGroups.clear();
  }

  addManager(): void {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = {
      complementaryObject: this.complementaryObject,
      theme: this.theme,
      availableRoles: this.availableRoles,
      selectedRole: this.selectedRole,
    };

    const dialogRef = this.dialog.open(AddManagerDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshUsers(true);
      }
    });
  }

  removeManager(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      managers: this.selectionUsers.selected,
      complementaryObject: this.complementaryObject,
      role: this.selectedRole,
      theme: this.theme,
      checkLastWarning: this.selectionUsers.selected.length === this.directAdminsIds.length,
    };

    const dialogRef = this.dialog.open(RemoveManagerDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.guiAuthResolver.isManagerPagePrivileged(this.complementaryObject)) {
          this.reloadEntityDetail.reloadEntityDetail(); //the table and data in it are updated with reloading the whole page
        } else {
          this.redirectToAuthRoute();
        }
      }
    });
  }

  removeGroup(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      groups: this.selectionGroups.selected,
      complementaryObject: this.complementaryObject,
      role: this.selectedRole,
      theme: this.theme,
      doCheckLastWarning: this.selectionGroups.selected.length === this.groups.length,
    };

    const dialogRef = this.dialog.open(RemoveGroupManagerDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.guiAuthResolver.isManagerPagePrivileged(this.complementaryObject)) {
          this.refreshGroups();
        } else {
          this.redirectToAuthRoute();
        }
      }
    });
  }

  addGroup(): void {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = {
      complementaryObject: this.complementaryObject,
      availableRoles: this.availableRoles,
      theme: this.theme,
      selectedRole: this.selectedRole,
    };

    const dialogRef = this.dialog.open(AddGroupManagerDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshGroups();
      }
    });
  }

  redirectToAuthRoute(): void {
    if (
      this.complementaryObjectType === 'Group' &&
      (this.guiAuthResolver.isAuthorized('getGroupById_int_policy', [this.complementaryObject]) ||
        this.guiAuthResolver.isAuthorized('getVoById_int_policy', [this.complementaryObject]))
    ) {
      if (
        this.guiAuthResolver.isAuthorized('getGroupById_int_policy', [this.complementaryObject])
      ) {
        const grp = this.complementaryObject as Group;
        void this.router.navigate(
          ['/organizations', grp.voId, 'groups', this.complementaryObject.id],
          {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
          },
        );
      } else if (
        this.guiAuthResolver.isAuthorized('getVoById_int_policy', [this.complementaryObject])
      ) {
        void this.router.navigate(['/organizations', this.complementaryObject['voId']], {
          queryParamsHandling: 'merge',
        });
      }
    } else if (
      this.complementaryObjectType === 'Facility' &&
      this.guiAuthResolver.isAuthorized('getFacilityById_int_policy', [this.complementaryObject])
    ) {
      void this.router.navigate(['/facilities', this.complementaryObject.id], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
      });
    } else if (
      this.complementaryObjectType === 'Vo' &&
      this.guiAuthResolver.isAuthorized('getVoById_int_policy', [this.complementaryObject])
    ) {
      void this.router.navigate(['/organizations', this.complementaryObject.id], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
      });
    } else if (
      this.complementaryObjectType === 'Resource' &&
      this.guiAuthResolver.isAuthorized('getRichResourceById_int_policy', [
        this.complementaryObject,
      ])
    ) {
      void this.router.navigate(['../../'], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
      });
    } else {
      void this.router.navigate(['/home'], { queryParamsHandling: 'merge' });
      return;
    }
    this.reloadEntityDetail.reloadEntityDetail();
  }
}
