import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  EnrichedFacility,
  FacilitiesManagerService,
  Facility,
  Group,
  GroupsManagerService,
  MembersManagerService,
  ResourcesManagerService,
  RichMember,
  RichResource,
  RichUser,
  RoleManagementRules,
  UsersManagerService,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { DisplayedRolePipe, ManageableEntitiesPipe } from '@perun-web-apps/perun/pipes';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  FacilitiesListComponent,
  GroupsListComponent,
  MembersListComponent,
  ResourcesListComponent,
  UsersListComponent,
  VosListComponent,
} from '@perun-web-apps/perun/components';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  selector: 'perun-web-apps-roles-panels',
  templateUrl: './roles-panels.component.html',
  styleUrls: ['./roles-panels.component.scss'],
  providers: [DisplayedRolePipe, ManageableEntitiesPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    CommonModule,
    ResourcesListComponent,
    GroupsListComponent,
    UsersListComponent,
    UiAlertsModule,
    MatProgressSpinnerModule,
    MembersListComponent,
    FacilitiesListComponent,
    VosListComponent,
    DisplayedRolePipe,
    MatExpansionModule,
    LoaderDirective,
  ],
})
export class RolesPanelsComponent {
  @Input() outerLoading: boolean;
  @Input() userId: number;
  @Input() userBased = true;
  @Output() reload = new EventEmitter<void>();
  @Output() startLoading = new EventEmitter<void>();
  @Output() currentlyOpenPanelChange = new EventEmitter<string | null>();

  loading: boolean;
  allRules: RoleManagementRules[] = [];
  voNames: Map<number, string> = new Map<number, string>();
  currentlyOpenPanel: string | null = null;

  selectedRole = new BehaviorSubject<RoleManagementRules>(null);

  groups: Observable<Group[]> = this.selectedRole.pipe(
    switchMap((role) => {
      this.loading = true;
      const ids = this.roles.get(role.roleName).get('Group');
      if (ids?.length) {
        return this.groupsService.getGroupsByIds(ids);
      } else {
        return of([] as Group[]);
      }
    }),
    tap(() => (this.loading = false)),
    startWith([]),
  );

  vos: Observable<Vo[]> = this.selectedRole.pipe(
    switchMap((role) => {
      this.loading = true;
      const ids = this.roles.get(role.roleName).get('Vo');
      if (ids?.length) {
        return this.vosService.getVosByIds(ids);
      } else {
        return of([] as Vo[]);
      }
    }),
    tap(() => (this.loading = false)),
    startWith([]),
  );

  facilities: Observable<EnrichedFacility[]> = this.selectedRole.pipe(
    switchMap((role) => {
      this.loading = true;
      const ids = this.roles.get(role.roleName).get('Facility');
      if (ids?.length) {
        return this.facilitiesService.getFacilitiesByIds(ids);
      } else {
        return of([] as Facility[]);
      }
    }),
    map((facilities) => facilities.map((f) => ({ facility: f }))),
    tap(() => (this.loading = false)),
    startWith([]),
  );

  resources: Observable<RichResource[]> = this.selectedRole.pipe(
    switchMap((role) => {
      this.loading = true;
      const ids = this.roles.get(role.roleName).get('Resource');
      if (ids?.length) {
        return this.resourcesService.getRichResourcesByIds(ids);
      } else {
        return of([] as RichResource[]);
      }
    }),
    tap(() => (this.loading = false)),
    startWith([]),
  );

  members: Observable<RichMember[]> = this.selectedRole.pipe(
    switchMap((role) => {
      this.loading = true;
      return this.membersService.getRichMembersByIds(this.roles.get(role.roleName).get('Member'));
    }),
    tap(() => (this.loading = false)),
    startWith([]),
  );

  users: Observable<RichUser[]> = this.selectedRole.pipe(
    switchMap((role) => {
      this.loading = true;
      return this.usersService.getRichUsersByIds(
        [this.userId].concat(this.roles.get(role.roleName).get('User')),
      );
    }),
    tap(() => (this.loading = false)),
    startWith([]),
  );

  _complementaryObjectsWithAuthzGroups = new Map<string, Map<string, Map<number, Group[]>>>();
  private _roles = new Map<string, Map<string, number[]>>();

  constructor(
    private usersService: UsersManagerService,
    private vosService: VosManagerService,
    private facilitiesService: FacilitiesManagerService,
    private resourcesService: ResourcesManagerService,
    private groupsService: GroupsManagerService,
    private membersService: MembersManagerService,
    private guiAuthResolver: GuiAuthResolver,
  ) {}

  get roles(): Map<string, Map<string, number[]>> {
    return this._roles;
  }

  @Input() set roles(roles: Map<string, Map<string, number[]>>) {
    this._roles = roles;
    // Update assigned rules with each change
    this.allRules = this.guiAuthResolver
      .getAllRules()
      .filter((rule) => this._roles.has(rule.roleName));
  }

  @Input() set complementaryObjectsWithAuthzGroups(
    compObjects: Map<string, Map<string, Map<number, Group[]>>>,
  ) {
    this._complementaryObjectsWithAuthzGroups = compObjects;
    this.updateVoNames();
  }

  onPanelOpen(role: RoleManagementRules, panel: MatExpansionPanel): void {
    if (
      role.primaryObject === null &&
      (!role.assignedObjects || Object.keys(role.assignedObjects).length === 0)
    ) {
      panel.close();
      return;
    }
    this.selectedRole.next(role);
    this.currentlyOpenPanel = role.roleName;
    this.currentlyOpenPanelChange.emit(role.roleName);
  }

  onPanelClosed(panel: string): void {
    if (this.currentlyOpenPanel === panel) {
      this.currentlyOpenPanel = null;
      this.currentlyOpenPanelChange.emit(null);
    }
  }

  isRoleExpandable(role: RoleManagementRules): boolean {
    return (
      role.primaryObject === null &&
      (!role.assignedObjects || Object.keys(role.assignedObjects).length === 0)
    );
  }

  private updateVoNames(): void {
    const voIds = new Set<number>();
    this._complementaryObjectsWithAuthzGroups.forEach((beanNamesMap) => {
      beanNamesMap.forEach((beanIdsToGroupsMap) => {
        beanIdsToGroupsMap.forEach((groups) => {
          groups.forEach((group) => {
            if (!voIds.has(group.voId) && !this.voNames.has(group.voId)) {
              voIds.add(group.voId);
            }
          });
        });
      });
    });

    if (voIds.size > 0) {
      this.vosService.getVosByIds([...voIds]).subscribe((vos) => {
        vos.forEach((vo) => {
          this.voNames.set(vo.id, vo.name);
        });
      });
    }
  }
}
