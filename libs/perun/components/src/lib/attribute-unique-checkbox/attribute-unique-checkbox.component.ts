import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AttributeDefinition } from '@perun-web-apps/perun/openapi';
import { DisableUniqueAttributePipe } from '@perun-web-apps/perun/pipes';

@Component({
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltip,
    DisableUniqueAttributePipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-attribute-unique-checkbox',
  templateUrl: './attribute-unique-checkbox.component.html',
  styleUrls: ['./attribute-unique-checkbox.component.scss'],
})
export class AttributeUniqueCheckboxComponent {
  @Input() attDef: AttributeDefinition;
}
