import { Component, OnInit} from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'perun-web-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private store:StoreService,
              private attributesManagerService: AttributesManagerService,
              private translateService:TranslateService) {
  }

  public static minWidth = 992;

  sideMenuBgColor = this.store.get('theme', 'sidemenu_bg_color');
  contentBackgroundColor = this.store.get('theme', 'content_bg_color');
  footerHeight = 180;

  ngOnInit(): void {
    this.attributesManagerService.getUserAttributes(this.store.getPerunPrincipal().userId).subscribe(atts =>{
     const prefLang = atts.find(elem => elem.friendlyName === 'preferredLanguage');
      if(prefLang && prefLang.value) {
        // @ts-ignore
        this.translateService.use(prefLang.value);
      }
    });
  }

  getContentHeight() {
    return 'calc(100vh - 64px - ' + this.footerHeight + 'px)';
  }
}
