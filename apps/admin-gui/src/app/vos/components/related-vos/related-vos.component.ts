import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Vo } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [CommonModule, MiddleClickRouterLinkDirective, RouterModule, TranslateModule],
  standalone: true,
  selector: 'app-related-vos',
  templateUrl: './related-vos.component.html',
  styleUrls: ['./related-vos.component.scss'],
})
export class RelatedVosComponent {
  @Input() title: string;
  @Input() vos: Vo[] = [];
}
