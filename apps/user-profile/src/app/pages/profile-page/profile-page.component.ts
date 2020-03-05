import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'perun-web-apps-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  currentLang = 'en';
  timeZones = moment.tz.names();
  selectedTimeZone: any;

  constructor(
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {

  }

  changeLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'cz' : 'en';
    this.translateService.use(this.currentLang);
  }

  getTimeZone(tz: string) {
    console.log(moment().tz(tz).format());
    this.selectedTimeZone = moment().tz(tz).format();
  }
}
