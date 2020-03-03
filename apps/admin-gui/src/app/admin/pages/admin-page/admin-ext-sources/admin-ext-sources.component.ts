import { Component, OnInit } from '@angular/core';
import { NotificatorService } from '../../../../core/services/common/notificator.service';
import { TranslateService } from '@ngx-translate/core';
import { ExtSource, ExtSourcesManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-admin-ext-sources',
  templateUrl: './admin-ext-sources.component.html',
  styleUrls: ['./admin-ext-sources.component.scss']
})
export class AdminExtSourcesComponent implements OnInit {

  constructor(private extSourceService: ExtSourcesManagerService,
              private notificator: NotificatorService,
              private translate: TranslateService
  ) {
    this.translate.get('ADMIN.EXT_SOURCES.LOAD_SUCCESS').subscribe(result => this.loadSuccess = result);
  }

  extSources: ExtSource[] = [];

  filterValue = '';

  loading = false;

  loadSuccess: string;

  ngOnInit() {
    this.refreshTable();
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  onLoad() {
    this.extSourceService.loadExtSourcesDefinitions().subscribe(() => {
      this.notificator.showSuccess(this.loadSuccess);
      this.refreshTable();
    });
  }

  refreshTable() {
    this.loading = true;
    this.extSourceService.getExtSources().subscribe(result => {
      this.extSources = result;
      this.loading = false;
    });
  }
}
