import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateService } from '@ngx-translate/core';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';

@NgModule({
  imports: [CommonModule, SettingsRoutingModule, SharedModule, PerunSharedComponentsModule],
})
export class SettingsModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'cs']);
  }
}
