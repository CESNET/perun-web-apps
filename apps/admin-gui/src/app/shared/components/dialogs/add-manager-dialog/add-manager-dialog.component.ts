import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthzResolverService,
  Facility,
  Group,
  RichUser,
  UsersManagerService,
  Vo
} from '@perun-web-apps/perun/openapi';
import { Role } from '@perun-web-apps/perun/models';
import { TABLE_ADD_MANAGER, TableConfigService } from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';
import { Urns } from '@perun-web-apps/perun/urns';

export interface AddManagerDialogData {
  complementaryObject: Vo | Group | Facility;
  theme: string;
  availableRoles: Role[];
  selectedRole: Role;
}

@Component({
  selector: 'app-add-manager-dialog',
  templateUrl: './add-manager-dialog.component.html',
  styleUrls: ['./add-manager-dialog.component.scss']
})
export class AddManagerDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddManagerDialogData,
    private authzService: AuthzResolverService,
    private usersService: UsersManagerService,
    private translate: TranslateService,
    private notificator: NotificatorService,
    protected route: ActivatedRoute,
    protected router: Router,
    private tableConfigService: TableConfigService
  ) {
    translate.get('DIALOGS.ADD_MANAGERS.TITLE').subscribe(value => this.title = value);
    translate.get('DIALOGS.ADD_MANAGERS.SUCCESS').subscribe(value => this.successMessage = value);
  }

  title: string;
  searchString = '';
  successMessage: string;

  selection = new SelectionModel<RichUser>(true, []);
  loading: boolean;
  users: RichUser[] = [];

  selectedRole: Role;
  firstSearchDone = false;
  availableRoles: Role[];
  theme: string;
  pageSize: number;
  tableId = TABLE_ADD_MANAGER;

  ngOnInit(): void {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.theme = this.data.theme;
    this.availableRoles = this.data.availableRoles;
    this.selectedRole = this.data.selectedRole;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.loading = true;
    this.authzService.setRoleWithUserComplementaryObject({role: this.selectedRole, users: this.selection.selected.map(u => u.id), complementaryObject: this.data.complementaryObject}).subscribe(() => {
      this.notificator.showSuccess(this.successMessage);
      this.loading = false;
      this.dialogRef.close();
    }, () => this.loading = false);
  }

  onSearchByString() {
    this.loading = true;

    this.selection.clear();

    this.usersService.findRichUsersWithAttributes(this.searchString, [
        Urns.USER_DEF_ORGANIZATION,
        Urns.USER_DEF_PREFERRED_MAIL,
        Urns.USER_DEF_LOGIN_CESNET,
        Urns.USER_DEF_LOGIN_EINFRA,
        Urns.USER_DEF_LOGIN_EINFRA_SERVICES,
        Urns.USER_DEF_LOGIN_MU]).subscribe(
      users => {
        this.users = users;
        this.loading = false;
        this.firstSearchDone = true;
      },
      () => this.loading = false
    );
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
