import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'perun-web-apps-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  currentLang = 'en';

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() {
  }

  changeLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'cz' : 'en';
    this.translateService.use(this.currentLang);
  }
}
