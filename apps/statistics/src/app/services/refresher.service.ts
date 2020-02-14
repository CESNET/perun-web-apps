import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefresherService {

  refresh = interval(60000);

  constructor() { }

  subscribe(observer?: () => void): Subscription {
    return this.refresh.subscribe(observer);
  }
}
