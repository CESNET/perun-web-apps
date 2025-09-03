import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AttributeAction,
  AttributeDefinition,
  AttributePolicyCollection,
} from '@perun-web-apps/perun/openapi';
import { AttributeRightsTabComponent } from '../attribute-rights-tab/attribute-rights-tab.component';

@Component({
  imports: [CommonModule, MatTabsModule, TranslateModule, AttributeRightsTabComponent],
  standalone: true,
  selector: 'perun-web-apps-attribute-rights-tab-group',
  templateUrl: './attribute-rights-tab-group.component.html',
  styleUrls: ['./attribute-rights-tab-group.component.scss'],
})
export class AttributeRightsTabGroupComponent {
  @Input() attDef: AttributeDefinition;
  @Input() collections: AttributePolicyCollection[] = [];
  actionTabs: AttributeAction[] = ['READ', 'WRITE'];
}
