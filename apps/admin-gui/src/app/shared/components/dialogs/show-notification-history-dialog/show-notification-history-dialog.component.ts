import { Component, OnInit } from '@angular/core';
import { NotificationStorageService } from '../../../../core/services/common/notification-storage.service';
import { NotificationData } from '../../../models/NotificationData';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-show-notification-history-dialog',
  templateUrl: './show-notification-history-dialog.component.html',
  styleUrls: ['./show-notification-history-dialog.component.scss']
})
export class ShowNotificationHistoryDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ShowNotificationHistoryDialogComponent>,
    notificationStorageService: NotificationStorageService,
  ) {
    this.notificationStorageService = notificationStorageService;
  }

  notificationStorageService: NotificationStorageService;
  notifications: NotificationData[];

  ngOnInit() {
    this.notifications = this.notificationStorageService.getNotifications();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
