import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GroupAdminRoles, RoleAssignmentType } from '@perun-web-apps/perun/openapi';
import { SelectedRoleFilterValuesPipe } from '@perun-web-apps/perun/pipes';
import { GroupRolePipe } from '@perun-web-apps/perun/pipes';
import { GroupRoleTypePipe } from '@perun-web-apps/perun/pipes';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectedRoleFilterValuesPipe,
    GroupRolePipe,
    GroupRoleTypePipe,
  ],
  standalone: true,
  selector: 'app-group-roles-filter',
  templateUrl: './group-roles-filter.component.html',
  styleUrls: ['./group-roles-filter.component.scss'],
})
export class GroupRolesFilterComponent {
  @Input()
  theme = '';
  @Output()
  filterRoles = new EventEmitter<GroupAdminRoles[]>();
  @Output()
  filterRoleTypes = new EventEmitter<RoleAssignmentType[]>();
  roles = new FormControl<GroupAdminRoles[]>([]);
  roleTypes = new FormControl<RoleAssignmentType[]>([]);
  rolesList: GroupAdminRoles[] = [
    GroupAdminRoles.GROUPADMIN,
    GroupAdminRoles.GROUPOBSERVER,
    GroupAdminRoles.GROUPMEMBERSHIPMANAGER,
  ];
  roleTypesList: RoleAssignmentType[] = [RoleAssignmentType.DIRECT, RoleAssignmentType.INDIRECT];

  changeRoleTypes(): void {
    this.filterRoleTypes.emit(this.roleTypes.value);
  }

  changeRoles(): void {
    this.filterRoles.emit(this.roles.value);
  }
}
