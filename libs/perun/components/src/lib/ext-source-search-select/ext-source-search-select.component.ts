import { TranslateModule } from '@ngx-translate/core';
import { EntitySearchSelectComponent } from '../entity-search-select/entity-search-select.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExtSource } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [CommonModule, EntitySearchSelectComponent, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-ext-source-search-select',
  templateUrl: './ext-source-search-select.component.html',
  styleUrls: ['./ext-source-search-select.component.scss'],
})
export class ExtSourceSearchSelectComponent {
  @Input() extSources: ExtSource[];
  @Output() extSourceSelected = new EventEmitter<ExtSource>();

  constructor() {}

  nameFunction = (extSource: ExtSource): string => extSource.name;
  secondaryTextFunction = (): string => '';
}
