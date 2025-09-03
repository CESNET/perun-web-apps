import { TranslateModule } from '@ngx-translate/core';
import { EntitySearchSelectComponent } from '../entity-search-select/entity-search-select.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Vo } from '@perun-web-apps/perun/openapi';
import { compareFnName } from '@perun-web-apps/perun/utils';

@Component({
  imports: [CommonModule, EntitySearchSelectComponent, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-vo-search-select',
  templateUrl: './vo-search-select.component.html',
  styleUrls: ['./vo-search-select.component.css'],
})
export class VoSearchSelectComponent implements OnChanges {
  @Input() vo: Vo;
  @Input() vos: Vo[];
  @Input() disableAutoSelect = false;
  @Input() required = false;
  @Output() voSelected = new EventEmitter<Vo>();

  nameFunction = (vo: Vo): string => vo.name;
  shortNameFunction = (vo: Vo): string => vo.shortName;
  searchFunction = (vo: Vo): string => vo.name + vo.shortName + String(vo.id);

  ngOnChanges(): void {
    this.vos.sort(compareFnName);
    if (!this.vo && !this.disableAutoSelect) {
      this.vo = this.vos[0];
    }
  }
}
