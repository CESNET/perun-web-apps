import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AttributeDefinition } from '@perun-web-apps/perun/openapi';
import { compareFnDisplayName } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'perun-web-apps-attribute-search-select',
  templateUrl: './attribute-search-select.component.html',
  styleUrls: ['./attribute-search-select.component.scss'],
})
export class AttributeSearchSelectComponent implements OnInit, OnChanges {
  @Input() attributes: AttributeDefinition[];
  @Input() attributesForEntity: 'user' | 'facility' | 'resource';
  @Output() attributeSelected = new EventEmitter<AttributeDefinition>();
  @Output() search = new EventEmitter<{ [p: string]: string }>();

  availableAttrDefs: AttributeDefinition[] = [];
  options: string[][] = [];

  nameFunction = (attr: AttributeDefinition): string => attr.displayName;
  secondaryTextFunction: (attr: AttributeDefinition) => string = (attr) => '#' + String(attr.id);

  ngOnInit(): void {
    this.availableAttrDefs = this.attributes
      .filter((attrDef) => attrDef.entity === this.attributesForEntity)
      .sort(compareFnDisplayName);

    this.addOption();
  }

  ngOnChanges(): void {
    this.options = [];
    this.addOption();
  }

  removeOption(option: string[]): void {
    this.options = this.options.filter((opt) => opt !== option);
  }

  addOption(): void {
    if (this.availableAttrDefs.length > 0) {
      this.options.push([
        this.availableAttrDefs[0].namespace + ':' + this.availableAttrDefs[0].friendlyName,
        '',
      ]);
    }
  }

  emptySearchString(): boolean {
    return this.options.some((opt) => opt[1].length === 0);
  }

  searchEntities(): void {
    const inputGetEntity: { [p: string]: string } = {};
    this.options.forEach((search) => {
      inputGetEntity[search[0]] = search[1];
    });
    this.search.emit(inputGetEntity);
  }
}
