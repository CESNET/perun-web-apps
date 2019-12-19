import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { PerunPrincipal } from '@perun-web-apps/perun/models';
import { StoreService } from '../../core/services/common/store.service';
import { AuthService } from '../../core/services/common/auth.service';
import { MatDialog } from '@angular/material';
import { ShowNotificationHistoryDialogComponent } from '../components/dialogs/show-notification-history-dialog/show-notification-history-dialog.component';
import { NotificationStorageService } from '../../core/services/common/notification-storage.service';

@Component({
  selector: 'app-perun-nav-menu',
  templateUrl: './perun-nav.component.html',
  styleUrls: ['./perun-nav.component.scss']
})
export class PerunNavComponent implements OnInit {

  constructor(private storeService: StoreService,
              private authService: AuthService,
              private dialog: MatDialog,
              private notificationStorageService: NotificationStorageService) {
  }

  logoutEnabled = true;

  @Input()
  sideNav: MatSidenav;

  @Input()
  principal: PerunPrincipal;

  ngOnInit(): void {
    this.logoutEnabled = this.storeService.get('log_out_enabled');
  }

  onLogOut() {
    this.authService.logout();
  }

  showNotificationHistory() {
    this.notificationStorageService.newNotificationsCount = 0;
    this.dialog.open(ShowNotificationHistoryDialogComponent, {
      width: '520px'
    });

  }

  getNewNotificationsCount(): number {
    return this.notificationStorageService.newNotificationsCount;
  }
}
