import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributePolicyCollection } from '@perun-web-apps/perun/openapi';
import { AttributeRightsItemComponent } from '../attribute-rights-item/attribute-rights-item.component';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatTooltip,
    AttributeRightsItemComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-attribute-rights-collection',
  templateUrl: './attribute-rights-collection.component.html',
  styleUrls: ['./attribute-rights-collection.component.scss'],
})
export class AttributeRightsCollectionComponent {
  @Input() collection: AttributePolicyCollection;
  @Output() collectionRemoved: EventEmitter<void> = new EventEmitter<void>();

  addPolicy(): void {
    this.collection.policies.push({
      id: -1,
      role: null,
      object: null,
      policyCollectionId: this.collection.id,
    });
  }

  removePolicy(index: number): void {
    this.collection.policies.splice(index, 1);
    if (this.collection.policies.length === 0) {
      this.removeCollection();
    }
  }

  removeCollection(): void {
    this.collectionRemoved.emit();
  }
}
