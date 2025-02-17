import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TABLE_USER_ASSOCIATED_USERS } from '@perun-web-apps/config/table-config';
import { RichUser, User, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { ConnectIdentityDialogComponent } from '../../../../../shared/components/dialogs/connect-identity-dialog/connect-identity-dialog.component';
import { DisconnectIdentityDialogComponent } from '../../../../../shared/components/dialogs/disconnect-identity-dialog/disconnect-identity-dialog.component';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { map, switchMap, tap, filter } from 'rxjs/operators';
import { userTableColumn } from '@perun-web-apps/perun/components';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-settings-associated-users',
  templateUrl: './user-settings-associated-users.component.html',
  styleUrls: ['./user-settings-associated-users.component.scss'],
})
export class UserSettingsAssociatedUsersComponent implements OnInit {
  loading = false;
  selection = new SelectionModel<RichUser>(
    false,
    [],
    true,
    (richUser1, richUser2) => richUser1.id === richUser2.id,
  );
  associatedUsers: RichUser[] = [];
  user: User;
  tableId = TABLE_USER_ASSOCIATED_USERS;
  displayedColumns: userTableColumn[] = [
    'select',
    'id',
    'user',
    'name',
    'email',
    'logins',
    'organization',
  ];
  addAuth: boolean;
  removeAuth: boolean;
  disableRouting: boolean;
  hasManagers: boolean;
  cacheSubject = new BehaviorSubject(true);

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public authResolver: GuiAuthResolver,
    private userManager: UsersManagerService,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.user = this.entityStorageService.getEntity();
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.userManager
      .getUsersBySpecificUser(this.user.id)
      .pipe(
        map((associatedUsers) => associatedUsers.map((user) => user.id)),
        tap((usersIds: number[]) => {
          if (usersIds.length === 0) {
            this.loading = false;
            this.associatedUsers = [];
            this.hasManagers = false;
          } else {
            this.hasManagers = true;
          }
        }),
        filter((usersIds: number[]) => usersIds.length > 0),
        switchMap((usersIds: number[]) =>
          this.userManager.getRichUsersWithAttributesByIds(usersIds),
        ),
      )
      .subscribe({
        next: (associatedUsers) => {
          this.associatedUsers = associatedUsers;
          this.cacheSubject.next(true);
          this.selection.clear();
          this.setAuth();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  setAuth(): void {
    this.addAuth = this.authResolver.isAuthorized('addSpecificUserOwner_User_User_policy', [
      this.user,
    ]);
    this.removeAuth = this.authResolver.isAuthorized('removeSpecificUserOwner_User_User_policy', [
      this.user,
    ]);
    this.disableRouting = !this.authResolver.isPerunAdminOrObserver();
  }

  onAdd(): void {
    const config = getDefaultDialogConfig();
    config.width = '1250px';
    config.data = {
      userId: this.user.id,
      theme: 'user-theme',
      isService: true,
      target: 'USER',
    };

    const dialogRef = this.dialog.open(ConnectIdentityDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onRemove(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = {
      identities: this.selection.selected,
      userId: this.user.id,
      specificUser: this.selection.selected[0],
      isService: true,
      theme: 'user-theme',
      targetTitle: 'USER',
      targetDescription: 'USER',
    };

    const dialogRef = this.dialog.open(DisconnectIdentityDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!this.authResolver.isAuthorized('getUsersBySpecificUser_User_policy', [this.user])) {
          void this.router.navigate(['/myProfile'], { queryParamsHandling: 'preserve' });
        } else {
          this.refreshTable();
        }
      }
    });
  }
}
