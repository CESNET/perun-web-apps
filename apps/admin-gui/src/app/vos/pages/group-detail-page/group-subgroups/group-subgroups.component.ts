import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../../../../shared/components/dialogs/create-group-dialog/create-group-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteGroupDialogComponent } from '../../../../shared/components/dialogs/delete-group-dialog/delete-group-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import {
  Group,
  GroupAdminRoles,
  GroupsManagerService,
  RoleAssignmentType,
} from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { TABLE_GROUP_SUBGROUPS } from '@perun-web-apps/config/table-config';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { GroupFlatNode } from '@perun-web-apps/perun/models';
import { MoveGroupDialogComponent } from '../../../../shared/components/dialogs/move-group-dialog/move-group-dialog.component';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-group-subgroups',
  templateUrl: './group-subgroups.component.html',
  styleUrls: ['./group-subgroups.component.scss'],
})
export class GroupSubgroupsComponent implements OnInit {
  static id = 'GroupSubgroupsComponent';

  // used for router animation
  @HostBinding('class.router-component') true;
  @ViewChild('toggle', { static: true }) toggle: MatSlideToggle;
  group: Group;
  groups: Group[] = [];
  selected: SelectionModel<Group> = new SelectionModel<Group>(
    true,
    [],
    true,
    (group1, group2) => group1.id === group2.id,
  );
  selectedRoles: GroupAdminRoles[] = [];
  selectedRoleTypes: RoleAssignmentType[] = [];
  showGroupList = false;
  loading: boolean;
  filtering = false;
  tableId = TABLE_GROUP_SUBGROUPS;
  filterValue = '';
  createAuth: boolean;
  deleteAuth: boolean;
  routeAuth: boolean;
  removeAuth$: Observable<boolean> = this.selected.changed.pipe(
    map((changed) => {
      return changed.source.selected.reduce(
        (acc, grp) =>
          acc && this.guiAuthResolver.isAuthorized('deleteGroup_Group_boolean_policy', [grp]),
        true,
      );
    }),
    startWith(true),
  );
  cacheSubject = new BehaviorSubject(true);

  constructor(
    private dialog: MatDialog,
    private groupService: GroupsManagerService,
    private guiAuthResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
    private cacheHelperService: CacheHelperService,
    private destroyRef: DestroyRef,
    private cd: ChangeDetectorRef,
  ) {}

  onCreateGroup(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = { parentGroup: this.group, theme: 'group-theme' };

    const dialogRef = this.dialog.open(CreateGroupDialogComponent, config);

    dialogRef.afterClosed().subscribe((groupCreated) => {
      if (groupCreated) {
        this.loading = true;
        this.refreshTable();
      }
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('preferedValue') === 'list') {
      this.toggle.toggle();
      this.selected.clear();
      this.showGroupList = true;
    }
    this.toggle.change.subscribe(() => {
      const value = this.toggle.checked ? 'list' : 'tree';
      localStorage.setItem('preferedValue', value);
    });

    this.group = this.entityStorageService.getEntity();
    this.setAuthRights();
    this.refreshTable();

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === GroupSubgroupsComponent.id) {
          this.refreshTable();
        }
      });
  }

  setAuthRights(): void {
    this.createAuth = this.guiAuthResolver.isAuthorized('createGroup_Group_Group_policy', [
      this.group,
    ]);
    this.deleteAuth = this.guiAuthResolver.isAuthorized('deleteGroups_List<Group>_boolean_policy', [
      this.group,
    ]);
    if (this.groups.length !== 0) {
      this.routeAuth = this.guiAuthResolver.isAuthorized('getGroupById_int_policy', [
        this.groups[0],
      ]);
    }
  }

  deleteGroup(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = { voId: this.group.id, groups: this.selected.selected, theme: 'group-theme' };

    const dialogRef = this.dialog.open(DeleteGroupDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }
  labelToggle(): void {
    this.showGroupList = !this.showGroupList;
    this.refreshTable();
  }
  refreshTable(): void {
    this.loading = true;
    this.groupService
      .getAllRichSubGroupsWithGroupAttributesByNames(
        this.group.id,
        [
          Urns.GROUP_DEF_MAIL_FOOTER,
          Urns.GROUP_SYNC_ENABLED,
          Urns.GROUP_LAST_SYNC_STATE,
          Urns.GROUP_LAST_SYNC_TIMESTAMP,
          Urns.GROUP_STRUCTURE_SYNC_ENABLED,
          Urns.GROUP_LAST_STRUCTURE_SYNC_STATE,
          Urns.GROUP_LAST_STRUCTURE_SYNC_TIMESTAMP,
        ],
        this.selectedRoles,
        this.selectedRoleTypes,
      )
      .subscribe((groups) => {
        this.groups = groups;
        this.cacheSubject.next(true);
        this.selected.clear();
        this.setAuthRights();
        this.loading = false;
      });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.filtering = filterValue !== '';
    this.selected.clear();
  }

  applyRoles(roles: GroupAdminRoles[]): void {
    this.selectedRoles = roles;
    this.refreshTable();
  }

  applyRoleTypes(types: RoleAssignmentType[]): void {
    this.selectedRoleTypes = types;
    this.refreshTable();
  }

  onMoveGroup(group: GroupFlatNode | Group): void {
    const config = getDefaultDialogConfig();
    config.width = '550px';
    config.data = {
      group: group,
      theme: 'group-theme',
    };

    const dialogRef = this.dialog.open(MoveGroupDialogComponent, config);
    dialogRef.afterClosed().subscribe((groupMoved) => {
      if (groupMoved) {
        this.refreshTable();
      }
    });
  }
}
