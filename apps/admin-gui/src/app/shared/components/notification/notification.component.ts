import {Component, Input} from '@angular/core';
import {NotificationData} from '../../models/NotificationData';
import { MatDialog } from '@angular/material/dialog';
import {NotificationDialogComponent} from '../notification-dialog/notification-dialog.component';
import { NotificationStorageService } from '../../../core/services/common/notification-storage.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  constructor(
    private dialog: MatDialog,
    private notificationStorageService: NotificationStorageService
  ) { }

  @Input()
  data: NotificationData;

  @Input()
  hideShadow: boolean;

  @Input()
  newNotification = false;

  alreadyPressed = false;

  doAction(): void {
    if(this.newNotification){
      this.alreadyPressed = true;
    }
    if(this.notificationStorageService.newNotificationsCount){
      this.notificationStorageService.newNotificationsCount--;
    }
    if (this.data.action !== undefined) {
      this.data.action();
    } else {
      this.dialog.open(NotificationDialogComponent, {
        width: '550px',
        data: this.data,
        autoFocus: false
      });
    }
  }
}
