import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from '@perun-web-apps/perun/models';
import { AttributePolicy, RoleManagementRules, RoleObject } from '@perun-web-apps/perun/openapi';
import { BehaviorSubject, Observable } from 'rxjs';
import { AttributeRightsService } from '@perun-web-apps/perun/services';
import { switchMap } from 'rxjs/operators';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { DisplayedRolePipe } from '@perun-web-apps/perun/pipes';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltip,
    DisplayedRolePipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-attribute-rights-item',
  templateUrl: './attribute-rights-item.component.html',
  styleUrls: ['./attribute-rights-item.component.scss'],
})
export class AttributeRightsItemComponent implements OnInit {
  @Input() policy: AttributePolicy;
  @Output() policyRemoved = new EventEmitter<void>();
  selectedRole: BehaviorSubject<Role>;
  roles: Observable<RoleManagementRules[]> = this.attrRightsService.getRoles();
  objects: Observable<RoleObject[]>;

  constructor(private attrRightsService: AttributeRightsService) {}

  ngOnInit(): void {
    this.selectedRole = new BehaviorSubject<Role>(this.policy.role as Role);
    this.objects = this.selectedRole.pipe(
      switchMap((role: Role) => this.attrRightsService.getObjects(role)),
    );
  }

  changeRole(event: MatSelectChange): void {
    this.selectedRole.next(event.value as Role);
    this.policy.object = 'None';
  }

  remove(): void {
    this.policyRemoved.emit();
  }
}
