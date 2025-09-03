import { TranslateModule } from '@ngx-translate/core';
import { OneEntityAttributePageComponent } from '../../../../shared/components/one-entity-attribute-page/one-entity-attribute-page.component';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { EntityStorageService } from '@perun-web-apps/perun/services';
import { Vo } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [CommonModule, OneEntityAttributePageComponent, TranslateModule],
  standalone: true,
  selector: 'app-vo-attributes',
  templateUrl: './vo-attributes.component.html',
  styleUrls: ['./vo-attributes.component.scss'],
})
export class VoAttributesComponent implements OnInit {
  @HostBinding('class.router-component') true;
  vo: Vo;

  constructor(private entityStorageService: EntityStorageService) {}

  ngOnInit(): void {
    this.vo = this.entityStorageService.getEntity();
  }
}
