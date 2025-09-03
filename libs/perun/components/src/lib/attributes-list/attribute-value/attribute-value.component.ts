import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AttributeValueMapComponent } from './attribute-value-map/attribute-value-map.component';
import { Attribute } from '@perun-web-apps/perun/openapi';
import { AttributeValueIntegerComponent } from './attribute-value-integer/attribute-value-integer.component';
import { AttributeValueListComponent } from './attribute-value-list/attribute-value-list.component';
import { AttributeValueStringComponent } from './attribute-value-string/attribute-value-string.component';
import { AttributeValueBooleanComponent } from './attribute-value-boolean/attribute-value-boolean.component';

@Component({
  imports: [
    CommonModule,
    AttributeValueMapComponent,
    AttributeValueIntegerComponent,
    AttributeValueListComponent,
    AttributeValueStringComponent,
    AttributeValueBooleanComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-attribute-value',
  templateUrl: './attribute-value.component.html',
  styleUrls: ['./attribute-value.component.scss'],
})
export class AttributeValueComponent {
  @ViewChild('map') mapComponent: AttributeValueMapComponent;
  @Input() attribute: Attribute;
  @Input() readonly = false;
  @Output() sendEventToParent2 = new EventEmitter();

  updateMapAttribute(): void {
    if (this.attribute.type === 'java.util.LinkedHashMap') {
      this.mapComponent.updateAttribute();
    }
  }

  _sendEventToParent2(): void {
    this.sendEventToParent2.emit();
  }
}
