import { Component, HostListener } from '@angular/core';
import {NotificationData} from '../../models/NotificationData';
import {NotificatorService} from '../../../core/services/common/notificator.service';
import {flyInOut} from '../../animations/Animations';
import { doAfterDelay } from '@perun-web-apps/perun/utils';
import { environment } from '../../../../environments/environment';
import { AppComponent } from '../../../app.component';
import { NotificationStorageService } from '../../../core/services/common/notification-storage.service';

@Component({
  selector: 'app-notificator',
  templateUrl: './notificator.component.html',
  styleUrls: ['./notificator.component.scss'],
  animations: [
    flyInOut
  ]
})
export class NotificatorComponent {

  constructor(
    private notificator: NotificatorService,
    private notificationStorageService: NotificationStorageService
  ) {
    this.notificator.addNotification.subscribe(notificationData => {
      this.processNotification(notificationData);
    });
    this.getScreenSize();
  }

  private mobileView = false;

  notifications: NotificationData[] = [];

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.mobileView = window.innerWidth <= AppComponent.minWidth;
  }

  private processNotification(data: NotificationData): void {
    this.notifications.push(data);
    this.notificationStorageService.storeNotification(data);

    doAfterDelay(data.delay, () => {
      this.notifications.shift();
    });
  }

  getNotificatorTop() {
    if (this.mobileView) {
      return 'initial';
    }
    return environment.production ? '112px' : '64px';
  }
}
