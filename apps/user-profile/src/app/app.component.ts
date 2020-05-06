import { Component, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'perun-web-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private store:StoreService,
              private attributesManagerService: AttributesManagerService,
              private translateService:TranslateService) {
  }

  sideMenuBgColor = this.store.get('theme', 'sidemenu_bg_color');
  contentBackgroundColor = this.store.get('theme', 'content_bg_color');

  ngOnInit(): void {
    this.attributesManagerService.getUserAttributes(this.store.getPerunPrincipal().userId).subscribe(atts =>{
     const prefLang = atts.find(elem => elem.friendlyName === 'preferredLanguage');
      console.log(prefLang.value);
      if(prefLang && prefLang.value) {
        // @ts-ignore
        this.translateService.use(prefLang.value);
      }
    });
  }
}
