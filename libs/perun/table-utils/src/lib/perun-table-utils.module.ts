import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UiMaterialModule } from '@perun-web-apps/ui/material';
import { MatRadioModule } from '@angular/material/radio';
import { ExportTableDialogComponent } from './export-table-dialog/export-table-dialog.component';
import { ExportDataDialogComponent } from './exporting-data-dialog/export-data-dialog.component';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { PerunPipesModule } from '@perun-web-apps/perun/pipes';
import { TableOptionsComponent } from './table-options/table-options.component';
import { TableWrapperComponent } from './table-wrapper/table-wrapper.component';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    UiMaterialModule,
    MatRadioModule,
    UiAlertsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    PerunPipesModule,
    ExportTableDialogComponent,
    ExportDataDialogComponent,
    TableOptionsComponent,
    TableWrapperComponent,
  ],
  exports: [
    ExportTableDialogComponent,
    ExportDataDialogComponent,
    TableOptionsComponent,
    TableWrapperComponent,
  ],
  providers: [],
})
export class PerunTableUtilsModule {}
