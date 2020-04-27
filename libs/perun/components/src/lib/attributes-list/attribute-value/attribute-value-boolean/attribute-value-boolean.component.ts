import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Attribute } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-attribute-value-boolean',
  templateUrl: './attribute-value-boolean.component.html',
  styleUrls: ['./attribute-value-boolean.component.scss']
})
export class AttributeValueBooleanComponent implements OnInit {

  constructor() {
  }

  @Input()
  attribute: Attribute;

  @Input()
  readonly = false;

  @Output() sendEventToParent = new EventEmitter();

  ngOnInit() {
  }

  _sendEventToParent() {
    this.sendEventToParent.emit();
  }
}
