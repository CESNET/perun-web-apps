import { Component, OnInit } from '@angular/core';
import {
  RegistrarManagerService,
  RichUserExtSource,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { GuiAuthResolver, StoreService } from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AddUserExtSourceDialogComponent } from '../../../../shared/components/dialogs/add-user-ext-source-dialog/add-user-ext-source-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { RemoveUserExtSourceDialogComponent } from '@perun-web-apps/perun/dialogs';
import { TABLE_USER_IDENTITIES } from '@perun-web-apps/config/table-config';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-identities',
  templateUrl: './user-identities.component.html',
  styleUrls: ['./user-identities.component.scss'],
})
export class UserIdentitiesComponent implements OnInit {
  userExtSources: RichUserExtSource[] = [];
  selection = new SelectionModel<RichUserExtSource>(
    false,
    [],
    true,
    (userExtSource1, userExtSource2) =>
      userExtSource1.userExtSource.id === userExtSource2.userExtSource.id,
  );
  userId: number;
  displayedColumns = ['select', 'id', 'extSourceName', 'login', 'lastAccess'];
  loading: boolean;
  tableId = TABLE_USER_IDENTITIES;
  filterValue = '';
  cachedSubject = new BehaviorSubject(true);

  constructor(
    private usersManagerService: UsersManagerService,
    private storage: StoreService,
    private registrarManagerService: RegistrarManagerService,
    private dialog: MatDialog,
    protected route: ActivatedRoute,
    public authResolver: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.route.parent.params.subscribe((params) => {
      this.userId = Number(params['userId']);
    });
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.selection.clear();
    this.cachedSubject.next(true);
    this.usersManagerService.getRichUserExtSources(this.userId).subscribe({
      next: (userExtSources) => {
        this.userExtSources = userExtSources;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  addIdentity(): void {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = { userId: this.userId };
    const dialogRef = this.dialog.open(AddUserExtSourceDialogComponent, config);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.refreshTable();
      }
    });
  }

  removeIdentity(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      showSuccess: true,
      theme: 'user-theme',
      userId: this.userId,
      extSources: this.selection.selected,
    };
    const dialogRef = this.dialog.open(RemoveUserExtSourceDialogComponent, config);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.refreshTable();
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }
}
