import { Component, HostListener} from '@angular/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { NotificationData } from '@perun-web-apps/perun/models';
import { AppComponent } from '../../app.component';
import { flyInOut } from '@perun-web-apps/perun/animations';

@Component({
  selector: 'perun-web-apps-notificator',
  templateUrl: './notificator.component.html',
  styleUrls: ['./notificator.component.scss'],
  animations: [
    flyInOut
  ]
})
export class NotificatorComponent {

  constructor(
    private notificator: NotificatorService
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
  }

  getNotificatorTop() {
    if (this.mobileView) {
      return 'initial';
    }
    return '64px';
  }

  removeNotification(index: number){
    this.notifications.splice(index, 1);
  }

}
