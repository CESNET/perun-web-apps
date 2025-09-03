import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  EnrichedFacility,
  FacilitiesManagerService,
  Group,
  GroupsManagerService,
  PerunBean,
  Resource,
  ResourcesManagerService,
  RoleManagementRules,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ExtractFacilityPipe,
  ManageableEntitiesPipe,
  ToEnrichedFacilityPipe,
  UnassignedRolePipe,
} from '@perun-web-apps/perun/pipes';
import {
  DebounceFilterComponent,
  FacilitiesListComponent,
  GroupsListComponent,
  ResourcesListComponent,
  VosListComponent,
} from '@perun-web-apps/perun/components';
import { combineLatestWith } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { RoleSearchSelectComponent } from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface AddRoleDialogData {
  entityId: number;
  roles: Map<string, Map<string, Array<number>>>;
}

export interface AddRoleForm {
  role: RoleManagementRules;
  entities: PerunBean[];
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    DebounceFilterComponent,
    TranslateModule,
    ResourcesListComponent,
    GroupsListComponent,
    FacilitiesListComponent,
    VosListComponent,
    RoleSearchSelectComponent,
    LoaderDirective,
    ExtractFacilityPipe,
    UnassignedRolePipe,
    ManageableEntitiesPipe,
    ToEnrichedFacilityPipe,
  ],
  standalone: true,
  selector: 'app-add-role-dialog',
  templateUrl: './add-role-dialog.component.html',
  styleUrls: ['./add-role-dialog.component.scss'],
})
export class AddRoleDialogComponent implements OnInit {
  @Input() loading = false;
  @Input() rules: RoleManagementRules[];
  @Input() roles: Map<string, Map<string, number[]>>;
  @Input() theme: string;
  @Output() submitForm = new EventEmitter<AddRoleForm>();

  @ViewChild(DebounceFilterComponent)
  filterComponent: DebounceFilterComponent;

  selectedRule: RoleManagementRules;
  selected = new SelectionModel<PerunBean>(true, [], true, (bean1, bean2) => bean1.id === bean2.id);
  cachedSubject = new BehaviorSubject(true);
  selectedFacilities = new SelectionModel<EnrichedFacility>(
    true,
    [],
    true,
    (enrichedFacility1, enrichedFacility2) =>
      enrichedFacility1.facility.id === enrichedFacility2.facility.id,
  );
  filterValue = '';
  vos: Vo[] = [];
  groups: Group[] = [];
  facilities: EnrichedFacility[] = [];
  resources: Resource[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddRoleDialogComponent>,
    private voService: VosManagerService,
    private groupService: GroupsManagerService,
    private facilityService: FacilitiesManagerService,
    private resourceService: ResourcesManagerService,
  ) {}

  ngOnInit(): void {
    this.selectedRule = this.rules[0];
    this.loadObjects();
  }

  loadObjects(): void {
    this.loading = true;
    if (this.rules.some((rule) => rule.primaryObject === 'Facility')) {
      // Not callable by SELF, need to check privilege
      this.facilityService.getAllFacilities().subscribe({
        next: (facilities) =>
          (this.facilities = new ToEnrichedFacilityPipe().transform(facilities)),
      });
    }
    if (this.rules.some((rule) => rule.primaryObject === 'Vo')) {
      this.voService.getMyVos().subscribe({ next: (vos) => (this.vos = vos) });
    }

    this.groupService
      .getAllGroupsFromAllVos()
      .pipe(combineLatestWith(this.resourceService.getAllResources()))
      .subscribe({
        next: ([groups, resources]) => {
          this.groups = groups;
          this.resources = resources;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  addRole(): void {
    if (this.selectedRule.primaryObject === 'Facility') {
      this.submitForm.emit({
        role: this.selectedRule,
        entities: this.selectedFacilities.selected.map((ef) => ef.facility),
      });
    } else {
      this.submitForm.emit({ role: this.selectedRule, entities: this.selected.selected });
    }
  }

  resetSelection(selectedRule: RoleManagementRules): void {
    this.selectedRule = selectedRule;
    this.selected.clear();
    this.cachedSubject.next(true);
    this.selectedFacilities.clear();
    this.filterValue = '';
    this.loadObjects();
    if (this.filterComponent) {
      this.filterComponent.control.setValue('');
    }
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.selected.clear();
    this.selectedFacilities.clear();
    this.cachedSubject.next(true);
  }
}
