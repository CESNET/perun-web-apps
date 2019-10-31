import { Inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { PerunApiService } from '@perun-web-apps/perun/services';
import { RTMessage } from '@perun-web-apps/perun/models';

@Injectable({
  providedIn: 'root'
})
export class RtMessagesService {

  constructor(
    @Inject(PERUN_API_SERVICE) private apiService: PerunApiService
  ) { }

  sendMessageToRT(queue: string, subject: string, text: string, showNotification = true): Observable<RTMessage> {
    return this.apiService.post('json/rtMessagesManager/sentMessageToRT', {
      queue: queue,
      subject: subject,
      text: text
    }, showNotification);
  }
}
