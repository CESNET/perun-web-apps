import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { UiMaterialModule } from '@perun-web-apps/ui/material';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [TranslateModule, CommonModule, ReactiveFormsModule, UiMaterialModule, MatRadioModule],
  declarations: [],
  exports: [],
  providers: [],
})
export class PerunUtilsModule {}
