import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { AttributeAction, AttributePolicyCollection } from '@perun-web-apps/perun/openapi';
import { AttributeRightsCollectionComponent } from '../attribute-rights-collection/attribute-rights-collection.component';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    UiAlertsModule,
    TranslateModule,
    MatTooltip,
    AttributeRightsCollectionComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-attribute-rights-tab',
  templateUrl: './attribute-rights-tab.component.html',
  styleUrls: ['./attribute-rights-tab.component.scss'],
})
export class AttributeRightsTabComponent implements OnChanges {
  @Input() attributeId: number | null;
  @Input() collections: AttributePolicyCollection[];
  @Input() action: AttributeAction;
  lastIndex: number;

  ngOnChanges(): void {
    this.lastIndex = this.findLastIndex();
  }

  addCollection(): void {
    this.collections.push({
      id: -1,
      attributeId: this.attributeId,
      action: this.action,
      policies: [{ id: -1, role: null, object: null, policyCollectionId: -1 }],
    });
    this.lastIndex = this.findLastIndex();
  }

  removeCollection(index: number): void {
    this.collections.splice(index, 1);
    this.lastIndex = this.findLastIndex();
  }

  findLastIndex(): number {
    let lastIdx = 0;
    for (let i = 0; i < this.collections.length; i++) {
      if (this.collections[i].action === this.action) {
        lastIdx = i;
      }
    }
    return lastIdx;
  }
}
