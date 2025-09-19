import { TranslateModule } from '@ngx-translate/core';
import { EntitySearchSelectComponent } from '../entity-search-select/entity-search-select.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoleManagementRules } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [CommonModule, EntitySearchSelectComponent, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-role-search-select',
  templateUrl: './role-search-select.component.html',
  styleUrls: ['./role-search-select.component.scss'],
})
export class RoleSearchSelectComponent {
  @Input() role: RoleManagementRules = null;
  @Input() roles: RoleManagementRules[];
  @Input() disableAutoSelect = false;
  @Output() roleSelected = new EventEmitter<RoleManagementRules>();

  nameFunction = (rule: RoleManagementRules): string => rule.displayName;
  secondaryTextFunction = (): string => null;
}
