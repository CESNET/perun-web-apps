import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
import {
  GUIConfigService,
  PREF_PAGE_SIZE,
  TableConfigService,
} from '@perun-web-apps/config/table-config';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-gui-configuration',
  templateUrl: './gui-configuration.component.html',
  styleUrls: ['./gui-configuration.component.scss'],
})
export class GuiConfigurationComponent implements OnInit {
  tablePageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  preferredTablePageSize: number;
  showIds: boolean;
  showIdSettingEnabled = false;

  constructor(
    private guiConfigService: GUIConfigService,
    private tableConfigService: TableConfigService,
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    switch (localStorage.getItem('showIds')) {
      case 'true':
        this.showIds = true;
        break;
      case 'false':
        this.showIds = false;
        break;
      default:
        this.showIds = false;
    }
    this.preferredTablePageSize = !Number.isNaN(this.guiConfigService.getNumber(PREF_PAGE_SIZE))
      ? this.guiConfigService.getNumber(PREF_PAGE_SIZE)
      : 10;
    if (this.storeService.getProperty('allow_show_id_setting')) {
      this.showIdSettingEnabled = true;
    }
  }

  updatePreferredTablePageSize(): void {
    this.guiConfigService.setNumber(PREF_PAGE_SIZE, this.preferredTablePageSize);
    this.tableConfigService.setGlobalPageSizeChanged();
  }

  toggleShowIds(): void {
    this.showIds = !this.showIds;
    this.guiConfigService.setString('showIds', this.showIds.toString());
    this.tableConfigService.setShowIds(this.showIds);
  }
}
