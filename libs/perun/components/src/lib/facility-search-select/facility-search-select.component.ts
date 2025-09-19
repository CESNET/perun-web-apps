import { TranslateModule } from '@ngx-translate/core';
import { EntitySearchSelectComponent } from '../entity-search-select/entity-search-select.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Facility } from '@perun-web-apps/perun/openapi';
import { compareFnName } from '@perun-web-apps/perun/utils';

@Component({
  imports: [CommonModule, EntitySearchSelectComponent, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-facility-search-select',
  templateUrl: './facility-search-select.component.html',
  styleUrls: ['./facility-search-select.component.css'],
})
export class FacilitySearchSelectComponent implements OnInit {
  @Input() facilities: Facility[];
  @Input() disableAutoSelect = false;
  @Input() selectPlaceholder = 'SHARED_LIB.PERUN.COMPONENTS.FACILITY_SEARCH_SELECT.SELECT_FACILITY';
  @Output() facilitySelected = new EventEmitter<Facility>();
  nameFunction = (facility: Facility): string => facility.name;

  ngOnInit(): void {
    this.facilities = this.facilities.sort(compareFnName);
  }
}
