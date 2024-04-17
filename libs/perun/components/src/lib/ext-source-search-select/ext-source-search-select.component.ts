import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExtSource } from '@perun-web-apps/perun/openapi';

@Component({
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
