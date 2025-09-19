import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MenuItem } from '@perun-web-apps/perun/models';
import { MultiWordDataCyPipe } from '@perun-web-apps/perun/pipes';
import { MatRipple } from '@angular/material/core';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    MiddleClickRouterLinkDirective,
    RouterModule,
    TranslateModule,
    MultiWordDataCyPipe,
    MatRipple,
  ],
  standalone: true,
  selector: 'perun-web-apps-menu-buttons-field',
  templateUrl: './menu-buttons-field.component.html',
  styleUrls: ['./menu-buttons-field.component.scss'],
})
export class MenuButtonsFieldComponent {
  @Input() items: MenuItem[];
}
