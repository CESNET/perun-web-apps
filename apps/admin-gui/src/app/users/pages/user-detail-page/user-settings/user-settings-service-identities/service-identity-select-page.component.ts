import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { RichUser, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { ConnectIdentityDialogComponent } from '../../../../../shared/components/dialogs/connect-identity-dialog/connect-identity-dialog.component';
import { DisconnectIdentityDialogComponent } from '../../../../../shared/components/dialogs/disconnect-identity-dialog/disconnect-identity-dialog.component';
import { GuiAuthResolver, StoreService } from '@perun-web-apps/perun/services';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SideMenuService } from '../../../../../core/services/common/side-menu.service';
import {
  userTableColumn,
  RefreshButtonComponent,
  UsersListComponent,
  PerunSharedComponentsModule,
} from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    RefreshButtonComponent,
    TranslateModule,
    UsersListComponent,
    LoaderDirective,
    LoadingTableComponent,
    PerunSharedComponentsModule,
    MatIcon,
  ],
  standalone: true,
  selector: 'app-user-service-identity-select-page',
  templateUrl: './service-identity-select-page.component.html',
  styleUrls: ['./service-identity-select-page.component.scss'],
})
export class ServiceIdentitySelectPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  loading = false;
  selection = new SelectionModel<RichUser>(
    false,
    [],
    false,
    (richUser1, richUser2) => richUser1.id === richUser2.id,
  );
  identities: RichUser[] = [];
  userId: number;
  displayedColumns: userTableColumn[] = ['select', 'id', 'user', 'name'];
  addIdentity: boolean;
  removeIdentity: boolean;
  routeToAdminSection = true;
  targetTitle = 'SERVICE';
  targetDescription = 'SERVICE';
  subscription: Subscription;
  cacheSubject = new BehaviorSubject(true);
  filterValue = '';
  classesForGlobalView = ['container-fluid', 'ps-xl-5', 'pe-xl-5', 'user-theme'];

  constructor(
    private sideMenuService: SideMenuService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private userManager: UsersManagerService,
    public authResolver: GuiAuthResolver,
    private store: StoreService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loading = true;

    this.subscription = this.route.parent.params.subscribe((params) => {
      this.userId = Number(params['userId']);
      if (!this.userId) {
        this.targetTitle = 'SERVICE';
        this.targetDescription = 'SELF';
        this.userId = this.store.getPerunPrincipal().userId;
        this.routeToAdminSection = false;
      }
      this.setAuthRights();
      this.refreshTable();
    });
  }

  ngAfterViewChecked(): void {
    this.sideMenuService.setFacilityMenuItems([]);
  }

  refreshTable(): void {
    this.loading = true;
    this.userManager.getSpecificUsersByUser(this.userId).subscribe((identities) => {
      this.identities = identities as RichUser[];
      this.cacheSubject.next(true);
      this.selection.clear();
      this.loading = false;
    });
  }

  setAuthRights(): void {
    this.addIdentity = this.authResolver.isPerunAdmin();
    this.removeIdentity = this.authResolver.isAuthorized(
      'removeSpecificUserOwner_User_User_policy',
      [{ id: this.userId, beanName: 'User' }],
    );
  }

  onAdd(): void {
    const config = getDefaultDialogConfig();
    config.width = '1250px';
    config.data = {
      userId: this.userId,
      theme: 'user-theme',
      isService: false,
      target: this.targetTitle,
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
      userId: this.userId,
      specificUser: this.selection.selected[0],
      theme: 'user-theme',
      targetTitle: this.targetTitle,
      targetDescription: this.targetDescription,
    };

    const dialogRef = this.dialog.open(DisconnectIdentityDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }
}
