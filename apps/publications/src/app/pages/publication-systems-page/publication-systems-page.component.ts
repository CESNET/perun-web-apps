import { Component, OnInit } from '@angular/core';
import { CabinetManagerService, PublicationSystem } from '@perun-web-apps/perun/openapi';
import { TABLE_GROUP_RESOURCES_LIST } from '@perun-web-apps/config/table-config';

@Component({
  selector: 'perun-web-apps-publication-systems-page',
  templateUrl: './publication-systems-page.component.html',
  styleUrls: ['./publication-systems-page.component.scss'],
})
export class PublicationSystemsPageComponent implements OnInit {
  constructor(private cabinetManagerService: CabinetManagerService) {}

  publicationSystems: PublicationSystem[] = [];
  loading: boolean;
  filterValue = '';
  tableId = TABLE_GROUP_RESOURCES_LIST;

  ngOnInit() {
    this.refreshTable();
  }

  refreshTable() {
    this.loading = true;
    this.cabinetManagerService.getPublicationSystems().subscribe((pubSys) => {
      this.publicationSystems = pubSys;
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }
}
