import { Injectable } from '@angular/core';
import { NotificationData } from '../../../shared/models/NotificationData';

@Injectable({
  providedIn: 'root'
})
export class NotificationStorageService {

  constructor() { }

  private notificationData : NotificationData[] = [];

  storeNotification(notification: NotificationData){
    this.notificationData.push(notification);
  }

  getNotifications(){
    return this.notificationData;
  }
}
