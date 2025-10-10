import { TranslateModule } from '@ngx-translate/core';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule, PerunSharedComponentsModule, TranslateModule],
  standalone: true,
  selector: 'app-perun-web-apps-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
})
export class NotFoundPageComponent {}
