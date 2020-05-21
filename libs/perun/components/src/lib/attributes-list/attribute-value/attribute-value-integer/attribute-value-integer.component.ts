import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attribute } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-attribute-value-integer',
  templateUrl: './attribute-value-integer.component.html',
  styleUrls: ['./attribute-value-integer.component.css']
})
export class AttributeValueIntegerComponent {

  constructor() {
  }

  @Input()
  attribute: Attribute;

  @Input()
  readonly = false;

  @Output() sendEventToParent = new EventEmitter();

  _sendEventToParent() {
    this.sendEventToParent.emit();
  }
}
