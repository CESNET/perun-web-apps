import {Component, Input} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import { PerunPrincipal } from '@perun-web-apps/perun/models';
import { MatDialog } from '@angular/material';
import { ShowNotificationHistoryDialogComponent } from '../components/dialogs/show-notification-history-dialog/show-notification-history-dialog.component';
import { NotificationStorageService } from '../../core/services/common/notification-storage.service';

@Component({
  selector: 'app-perun-nav-menu',
  templateUrl: './perun-nav.component.html',
  styleUrls: ['./perun-nav.component.scss']
})
export class PerunNavComponent {

  constructor(
    private dialog: MatDialog,
    private notificationStorageService:NotificationStorageService
  ) { }

  @Input()
  sideNav: MatSidenav;

  @Input()
  principal: PerunPrincipal;

  showNotificationHistory() {
    this.dialog.open(ShowNotificationHistoryDialogComponent, {
      width: '520px'
    });

  }

  hasNotifications(): boolean {
    return this.notificationStorageService.getNotifications().length !== 0;
  }
}
