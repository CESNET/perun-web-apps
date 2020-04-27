import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Attribute } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-attribute-value-string',
  templateUrl: './attribute-value-string.component.html',
  styleUrls: ['./attribute-value-string.component.scss']
})
export class AttributeValueStringComponent implements OnInit {

  constructor() {
  }

  @Input()
  attribute: Attribute;

  @Input()
  readonly = false;

  @Output() sendEventToParent = new EventEmitter();

  value: string;

  ngOnInit() {
    this.value = <string><unknown>this.attribute.value;
  }

  _sendEventToParent() {
    this.sendEventToParent.emit();
  }
}
