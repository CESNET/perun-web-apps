import {Component, Input, OnInit} from '@angular/core';
import { Attribute } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-attribute-value-map',
  templateUrl: './attribute-value-map.component.html',
  styleUrls: ['./attribute-value-map.component.scss']
})
export class AttributeValueMapComponent implements OnInit {

  constructor() {
  }

  @Input()
  attribute: Attribute;

  keys: string[] = [];
  values: string[] = [];


  ngOnInit() {
    if (this.attribute.value !== undefined) {
      const map = this.attribute.value as Map<string, string>;
      for (const [key, value] of Object.entries(map)) {
        this.keys.push(key);
        this.values.push(value);
      }
    }
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  addValue() {
    this.keys.push('');
    this.values.push('');
  }

  removeValue(index: number) {
    this.keys.splice(index, 1);
    this.values.splice(index, 1);
  }

  updateAttribute() {
    const map = {};
    for (let i = 0; i < this.keys.length; i++) {
      map[this.keys[i]] = this.values[i];
    }
    if (this.keys.length === 0) {
      this.attribute.value = undefined;
    } else {
      this.attribute.value = map;
    }
  }
}

