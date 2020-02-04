import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NotificationData} from '../../models/NotificationData';
import { MatDialog } from '@angular/material/dialog';
import {NotificationDialogComponent} from '../notification-dialog/notification-dialog.component';
import { NotificationStorageService } from '../../../core/services/common/notification-storage.service';
import { doAfterDelay } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit{

  constructor(
    private dialog: MatDialog,
    private notificationStorageService: NotificationStorageService
  ) { }

  @Input()
  data: NotificationData;

  @Input()
  inDialog: boolean;

  @Input()
  newNotification = false;

  @Output()
  closeNotification: EventEmitter<NotificationData> = new EventEmitter<NotificationData>();

  alreadyPressed = false;
  alreadyClosed = false;
  waiting = false;

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
      const dialogRef = this.dialog.open(NotificationDialogComponent, {
        width: '550px',
        data: this.data,
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe(() =>{
        this.closeSelf();
      });
    }
  }

  closeSelf(){
    if(!this.inDialog){
      if(this.newNotification){
        this.alreadyClosed = true;
      }
      if(this.notificationStorageService.newNotificationsCount){
        this.notificationStorageService.newNotificationsCount--;
      }
      this.closeNotification.emit();
    }
  }

  ngOnInit(): void {
    doAfterDelay(this.data.delay, () => {
      if(!this.alreadyClosed && !this.waiting){
        this.closeSelf();
      }
    });
  }
}
