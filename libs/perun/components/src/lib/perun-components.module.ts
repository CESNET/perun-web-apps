import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { VoSelectTableComponent } from './vo-select-table/vo-select-table.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { RefreshButtonComponent } from './refresh-button/refresh-button.component';
import { GroupMenuComponent } from './group-menu/group-menu.component';
import { TableOptionsComponent } from './table-options/table-options.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { ImmediateFilterComponent } from './immediate-filter/immediate-filter.component';

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatTableModule,
    MatTableExporterModule,
    TranslateModule,
    RouterModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    UiAlertsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  declarations: [
    VoSelectTableComponent,
    GroupsListComponent,
    TableOptionsComponent,
    GroupMenuComponent,
    RefreshButtonComponent,
    BackButtonComponent,
    ImmediateFilterComponent
  ],
  exports: [
    VoSelectTableComponent,
    GroupsListComponent,
    TableOptionsComponent,
    GroupMenuComponent,
    RefreshButtonComponent,
    BackButtonComponent,
    ImmediateFilterComponent
  ]
})
export class PerunSharedComponentsModule {
}
