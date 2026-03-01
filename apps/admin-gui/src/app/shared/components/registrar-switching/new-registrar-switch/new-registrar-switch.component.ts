import { Component, computed, Input, OnInit, signal, Type } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgComponentOutlet } from '@angular/common';
import { AttributesManagerService, Member, PerunBean } from '@perun-web-apps/perun/openapi';
import { EntityStorageService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-new-registrar-switch',
  templateUrl: 'new-registrar-switch.component.html',
  styleUrls: ['new-registrar-switch.component.scss'],
  standalone: true,
  imports: [MatProgressSpinner, NgComponentOutlet],
})
export class NewRegistrarSwitchComponent implements OnInit {
  @Input({ required: true }) voOld!: Type<unknown>;
  @Input({ required: true }) voNew!: Type<unknown>;
  @Input({ required: true }) groupOld!: Type<unknown>;
  @Input({ required: true }) groupNew!: Type<unknown>;

  loading = true;
  selected = computed(() => {
    if (this.entityType === 'Vo') {
      return this.useNew() ? this.voNew : this.voOld;
    }
    return this.useNew() ? this.groupNew : this.groupOld;
  });
  useNew = signal(false);
  entityType: 'Vo' | 'Group' | 'RichGroup' | 'RichMember';

  constructor(
    private attributesManager: AttributesManagerService,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    const entity: PerunBean = this.entityStorageService.getEntity();
    if (entity.beanName === 'Vo' || entity.beanName === 'RichMember') {
      this.entityType = entity.beanName;
      const voId = this.entityType === 'RichMember' ? (entity as Member).voId : entity.id;
      this.attributesManager
        .getVoAttributeByName(voId, 'urn:perun:vo:attribute-def:def:useNewRegistration')
        .subscribe({
          next: (attr) => {
            this.useNew.set(attr?.value === null ? false : (attr.value as boolean));
            this.loading = false;
          },
          error: () => (this.loading = false),
        });
    } else if (entity.beanName === 'Group' || entity.beanName === 'RichGroup') {
      this.entityType = entity.beanName;
      this.attributesManager
        .getGroupAttributeByName(entity.id, 'urn:perun:group:attribute-def:def:useNewRegistration')
        .subscribe({
          next: (attr) => {
            this.useNew.set(attr?.value === null ? false : (attr.value as boolean));
            this.loading = false;
          },
          error: () => (this.loading = false),
        });
    }
  }
}
