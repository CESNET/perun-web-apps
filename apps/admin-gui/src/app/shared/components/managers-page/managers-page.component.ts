import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AddManagerDialogComponent } from '../dialogs/add-manager-dialog/add-manager-dialog.component';
import { RemoveManagerDialogComponent } from '../dialogs/remove-manager-dialog/remove-manager-dialog.component';
import { RemoveGroupManagerDialogComponent } from '../dialogs/remove-group-manager-dialog/remove-group-manager-dialog.component';
import { AddGroupManagerDialogComponent } from '../dialogs/add-group-manager-dialog/add-group-manager-dialog.component';
import { AuthzResolverService, Facility, Group, RichUser, Vo } from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { Role } from '@perun-web-apps/perun/models';
import { TABLE_GROUP_MANAGERS_PAGE, TableConfigService } from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-managers-page',
  templateUrl: './managers-page.component.html',
  styleUrls: ['./managers-page.component.scss']
})
export class ManagersPageComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private dialog: MatDialog,
    private tableConfigService: TableConfigService,
    private authzService: AuthzResolverService
  ) {
  }


  groups: Group[] = null;
  managers: RichUser[] = null;

  @Input()
  complementaryObject: Group | Vo | Facility;

  @Input()
  availableRoles: Role[];

  @Input()
  complementaryObjectType: string;

  @Input()
  theme: string;

  selectionUsers = new SelectionModel<RichUser>(true, []);
  selectionGroups = new SelectionModel<Group>(true, []);

  selected = 'user';
  selectedRole: Role;

  loading = false;

  tableId = TABLE_GROUP_MANAGERS_PAGE;
  pageSize: number;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.selectedRole = this.availableRoles[0];
    this.changeUser();
  }

  changeUser() {
    this.loading = true;
    if (this.selected === 'user') {
      this.authzService.getAuthzRichAdmins(this.selectedRole, this.complementaryObject.id, this.complementaryObjectType,
        [
          Urns.USER_DEF_ORGANIZATION,
          Urns.USER_DEF_PREFERRED_MAIL,
          Urns.USER_DEF_LOGIN_CESNET,
          Urns.USER_DEF_LOGIN_EINFRA,
          Urns.USER_DEF_LOGIN_EINFRA_SERVICES,
          Urns.USER_DEF_LOGIN_MU],false, true).subscribe(managers => {
        this.managers = managers;
        this.selectionUsers.clear();
        this.selectionGroups.clear();
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    }
    if (this.selected === 'group') {
      this.authzService.getAuthzAdminGroups(this.selectedRole, this.complementaryObject.id, this.complementaryObjectType).subscribe(groups => {
        this.groups = groups;
        this.selectionUsers.clear();
        this.selectionGroups.clear();
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    }
  }

  addManager() {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = {
      complementaryObject: this.complementaryObject,
      theme: this.theme,
      availableRoles: this.availableRoles,
      selectedRole: this.selectedRole
    };

    const dialogRef = this.dialog.open(AddManagerDialogComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      this.changeUser();
    });
  }

  removeManager() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      managers: this.selectionUsers.selected,
      complementaryObject: this.complementaryObject,
      role: this.selectedRole,
      theme: this.theme
    };

    const dialogRef = this.dialog.open(RemoveManagerDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeUser();
      }
    });
  }

  removeGroup() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      groups: this.selectionGroups.selected,
      complementaryObject: this.complementaryObject,
      role: this.selectedRole,
      theme: this.theme
    };

    const dialogRef = this.dialog.open(RemoveGroupManagerDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeUser();
      }
    });
  }

  addGroup() {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = {
      complementaryObject: this.complementaryObject,
      availableRoles: this.availableRoles,
      theme: this.theme,
      selectedRole: this.selectedRole
    };

    const dialogRef = this.dialog.open(AddGroupManagerDialogComponent, config);
    dialogRef.afterClosed().subscribe(() => {
      this.changeUser();
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
