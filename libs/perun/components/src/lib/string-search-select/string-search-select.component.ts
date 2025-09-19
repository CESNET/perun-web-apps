import { EntitySearchSelectComponent } from '../entity-search-select/entity-search-select.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [CommonModule, EntitySearchSelectComponent],
  standalone: true,
  selector: 'perun-web-apps-string-search-select',
  templateUrl: './string-search-select.component.html',
  styleUrls: ['./string-search-select.component.scss'],
})
export class StringSearchSelectComponent {
  @Input() values: string[];
  @Input() preselectedValues: string[];
  @Input() selectPlaceholder: string;
  @Input() mainTextFunction: (string) => string;
  @Output() valueSelection = new EventEmitter<string[]>();
  @Output() selectClosed = new EventEmitter<boolean>();

  defaultTextFunction = (entity: string): string => entity;
  secondaryTextFunction = (): string => '';
}
