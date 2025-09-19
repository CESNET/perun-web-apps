import { TranslateModule } from '@ngx-translate/core';
import { EntitySearchSelectComponent } from '../entity-search-select/entity-search-select.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [CommonModule, EntitySearchSelectComponent, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-audit-log-search-select',
  templateUrl: './audit-log-search-select.component.html',
  styleUrls: ['./audit-log-search-select.component.scss'],
})
export class AuditLogSearchSelectComponent {
  @Input() auditLogs: string[];
  @Input() disableDeselectButton = true;
  @Output() auditLogsSelected = new EventEmitter<string[]>();
  @Output() selectClosed = new EventEmitter<boolean>();

  searchFunction = (entity: string): string => entity;
  mainTextFunction = (entity: string): string => entity;
  secondaryTextFunction = (): string => '';
}
