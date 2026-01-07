import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { ExtSource, ExtSourcesManagerService } from '@perun-web-apps/perun/openapi';
import { ExtSourcesListComponent } from '../../../../shared/components/ext-sources-list/ext-sources-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    ExtSourcesListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-admin-ext-sources',
  templateUrl: './admin-ext-sources.component.html',
  styleUrls: ['./admin-ext-sources.component.scss'],
})
export class AdminExtSourcesComponent implements OnInit {
  extSources: ExtSource[] = [];

  filterValue = '';

  loading = false;

  constructor(
    private extSourceService: ExtSourcesManagerService,
    public authResolver: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.refreshTable();
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }

  loadConfigExtSources(): void {
    this.loading = true;
    this.extSourceService.loadExtSourcesDefinitions().subscribe(() => {
      this.refreshTable();
    });
  }

  refreshTable(): void {
    this.loading = true;
    this.extSourceService.getExtSources().subscribe((result) => {
      this.extSources = result;
      this.loading = false;
    });
  }
}
