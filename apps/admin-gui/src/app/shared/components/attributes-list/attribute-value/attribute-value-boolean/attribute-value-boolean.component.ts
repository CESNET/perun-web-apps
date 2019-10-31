import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Attribute } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-attribute-value-boolean',
  templateUrl: './attribute-value-boolean.component.html',
  styleUrls: ['./attribute-value-boolean.component.scss']
})
export class AttributeValueBooleanComponent implements OnInit {

  constructor() {
  }

  @Input()
  attribute: Attribute;

  @Output() sendEventToParent = new EventEmitter();

  ngOnInit() {
  }

  _sendEventToParent() {
    this.sendEventToParent.emit();
  }
}
