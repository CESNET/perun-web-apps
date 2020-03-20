import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceConfiguratorComponent } from './service-configurator/service-configurator.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';

@NgModule({
  imports: [CommonModule, MatTabsModule, PerunSharedComponentsModule],
  declarations: [ServiceConfiguratorComponent],
  exports: [ServiceConfiguratorComponent]
})
export class PerunFacilityServicesConfigModule {}
