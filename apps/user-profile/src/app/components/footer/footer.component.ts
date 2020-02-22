import { Component, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';

export interface ElementItem {
  link: string;
  label: string;
}

export interface FooterItem {
  title: string;
  elements: ElementItem[]
}

@Component({
  selector: 'perun-web-apps-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private storeService:StoreService) { }

  items: FooterItem[];
  copyright: string;

  headersTextColor = this.storeService.get('theme', 'footer_headers_text_color');
  linksTextColor = this.storeService.get('theme', 'footer_links_text_color');
  iconColor = this.storeService.get('theme', 'footer_icon_color');
  bgColor = this.storeService.get('theme', 'footer_bg_color');


  ngOnInit() {
    this.items = this.storeService.get('footer', 'columns');
    this.copyright = this.storeService.get('footer', 'copyright');
  }

}
