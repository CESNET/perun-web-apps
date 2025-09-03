import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CabinetManagerService, PublicationSystem } from '@perun-web-apps/perun/openapi';
import { TABLE_GROUP_RESOURCES_LIST } from '@perun-web-apps/config/table-config';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { PublicationSystemsListComponent } from '../../components/publication-systems-list/publication-systems-list.component';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    LoaderDirective,
    PublicationSystemsListComponent,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-publication-systems-page',
  templateUrl: './publication-systems-page.component.html',
  styleUrls: ['./publication-systems-page.component.scss'],
})
export class PublicationSystemsPageComponent implements OnInit {
  publicationSystems: PublicationSystem[] = [];
  loading: boolean;
  filterValue = '';
  tableId = TABLE_GROUP_RESOURCES_LIST;

  constructor(private cabinetManagerService: CabinetManagerService) {}

  ngOnInit(): void {
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.cabinetManagerService.getPublicationSystems().subscribe((pubSys) => {
      this.publicationSystems = pubSys;
      this.loading = false;
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }
}
