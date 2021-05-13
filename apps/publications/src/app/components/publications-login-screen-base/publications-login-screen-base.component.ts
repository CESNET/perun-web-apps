import { Component, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'perun-web-apps-publications-login-screen-base',
  templateUrl: './publications-login-screen-base.component.html',
  styleUrls: ['./publications-login-screen-base.component.scss']
})
export class PublicationsLoginScreenBaseComponent implements OnInit {

  constructor(private storeService: StoreService,
              private sanitizer: DomSanitizer) { }

  bgColor = this.storeService.get('theme', 'header_bg_color');
  textColor = this.storeService.get('theme', 'header_text_color');
  iconColor = this.storeService.get('theme', 'header_icon_color');

  footerHeight = 200;
  logo: any;

  ngOnInit() {
    this.logo = this.sanitizer.bypassSecurityTrustHtml(this.storeService.get('logo'));
  }

  getContentHeight() {
    return 'calc(100vh - 84px - ' + this.footerHeight + 'px)';
  }

}
