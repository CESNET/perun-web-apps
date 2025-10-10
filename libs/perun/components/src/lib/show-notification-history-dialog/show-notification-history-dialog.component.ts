import { TranslateModule } from '@ngx-translate/core';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationStorageService } from '@perun-web-apps/perun/services';
import { NotificationData } from '@perun-web-apps/perun/models';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificationComponent } from '../notification/notification.component';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    UiAlertsModule,
    CustomTranslatePipe,
    TranslateModule,
    NotificationComponent,
    CdkVirtualForOf,
    CdkFixedSizeVirtualScroll,
    CdkVirtualScrollViewport,
  ],
  standalone: true,
  selector: 'perun-web-apps-show-notification-history-dialog',
  templateUrl: './show-notification-history-dialog.component.html',
  styleUrls: ['./show-notification-history-dialog.component.scss'],
})
export class ShowNotificationHistoryDialogComponent implements OnInit {
  notificationStorageService: NotificationStorageService;
  notifications: NotificationData[];

  constructor(
    private dialogRef: MatDialogRef<ShowNotificationHistoryDialogComponent>,
    notificationStorageService: NotificationStorageService,
  ) {
    this.notificationStorageService = notificationStorageService;
  }

  ngOnInit(): void {
    this.notifications = this.notificationStorageService.getNotifications();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onClear(): void {
    this.notificationStorageService.clearNotifications();
    this.notifications = [];
  }
}
