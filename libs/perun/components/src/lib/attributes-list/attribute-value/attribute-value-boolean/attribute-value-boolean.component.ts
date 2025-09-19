import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attribute } from '@perun-web-apps/perun/openapi';
import { isVirtualAttribute } from '@perun-web-apps/perun/utils';
import { MultiWordDataCyPipe } from '@perun-web-apps/perun/pipes';
import { MatLabel } from '@angular/material/input';

@Component({
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MultiWordDataCyPipe,
    MatLabel,
  ],
  standalone: true,
  selector: 'perun-web-apps-attribute-value-boolean',
  templateUrl: './attribute-value-boolean.component.html',
  styleUrls: ['./attribute-value-boolean.component.scss'],
})
export class AttributeValueBooleanComponent implements OnInit {
  @Input() attribute: Attribute;
  @Input() readonly = false;
  @Output() sendEventToParent = new EventEmitter();

  ngOnInit(): void {
    if (!this.readonly) {
      this.readonly = isVirtualAttribute(this.attribute);
    }
  }

  _sendEventToParent(): void {
    this.sendEventToParent.emit();
  }
}
