import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnimatedRouterOutletComponent } from '../../../../../../shared/components/animated-router-outlet/animated-router-outlet.component';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SideMenuService } from '../../../../../../core/services/common/side-menu.service';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { SideMenuItemService } from '../../../../../../shared/side-menu/side-menu-item.service';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { EditUserDialogComponent } from '../../../../../../shared/components/dialogs/edit-user-dialog/edit-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EntityPathParam } from '@perun-web-apps/perun/models';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MiddleClickRouterLinkDirective,
    PerunSharedComponentsModule,
    AnimatedRouterOutletComponent,
    RouterModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip,
    UserFullNamePipe,
  ],
  standalone: true,
  selector: 'app-service-identity-detail-page',
  templateUrl: './service-identity-detail-page.component.html',
  styleUrls: ['./service-identity-detail-page.component.css'],
})
export class ServiceIdentityDetailPageComponent implements OnInit {
  user: User;
  loading = false;

  constructor(
    private sideMenuService: SideMenuService,
    private usersService: UsersManagerService,
    private sideMenuItemService: SideMenuItemService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params) => {
      const userId = Number(params['userId']);
      this.entityStorageService.setEntityAndPathParam(
        { id: userId, beanName: 'User' },
        EntityPathParam.User,
      );

      this.usersService.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user;

          const userItem = this.sideMenuItemService.parseServiceIdentity(user);
          this.sideMenuService.setUserItems([userItem]);
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    });
  }

  getUserType(): string {
    if (this.user.serviceUser) {
      return 'Service';
    }
    return 'Person';
  }

  editUser(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      theme: 'admin-theme',
      user: this.user,
    };

    const dialogRef = this.dialog.open(EditUserDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usersService.getUserById(this.user.id).subscribe((user) => {
          this.user = user;
        });
      }
    });
  }
}
