import { Component, DestroyRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Group,
  GroupsManagerService,
  ResourcesManagerService,
} from '@perun-web-apps/perun/openapi';
import { TABLE_GROUP_RESOURCES_LIST } from '@perun-web-apps/config/table-config';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupResourceDialogComponent } from '../../../../shared/components/dialogs/add-group-resource-dialog/add-group-resource-dialog.component';
import { RemoveGroupResourceDialogComponent } from '../../../../shared/components/dialogs/remove-group-resource-dialog/remove-group-resource-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { ResourcesListComponent } from '@perun-web-apps/perun/components';
import { ResourceWithStatus } from '@perun-web-apps/perun/models';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-group-resources',
  templateUrl: './group-resources.component.html',
  styleUrls: ['./group-resources.component.scss'],
})
export class GroupResourcesComponent implements OnInit {
  static id = 'GroupResourcesComponent';

  // used for router animation
  @HostBinding('class.router-component') true;
  @ViewChild('list', {})
  list: ResourcesListComponent;

  group: Group;
  resources: ResourceWithStatus[] = [];
  selected = new SelectionModel<ResourceWithStatus>(
    true,
    [],
    true,
    (richResource1, richResource2) => richResource1.id === richResource2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  resourcesToDisable: Set<number>;
  loading: boolean;
  filterValue = '';
  tableId = TABLE_GROUP_RESOURCES_LIST;
  routingAuth: boolean;
  addAuth = false;

  constructor(
    private resourcesManager: ResourcesManagerService,
    private groupService: GroupsManagerService,
    private dialog: MatDialog,
    private guiAuthResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
    private cacheHelperService: CacheHelperService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.group = this.entityStorageService.getEntity();
    this.setAuthorization();
    this.refreshTable();

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === GroupResourcesComponent.id) {
          this.refreshTable();
        }
      });
  }

  setAuthorization(): void {
    if (this.resources !== null && this.resources.length !== 0) {
      this.routingAuth = this.guiAuthResolver.isAuthorized('getResourceById_int_policy', [
        this.resources[0],
      ]);
    }
    this.addAuth = this.guiAuthResolver.isAuthorized('getResources_Vo_policy', [this.group]);
  }

  refreshTable(): void {
    this.loading = true;
    this.resourcesManager.getResourceAssignments(this.group.id).subscribe((resources) => {
      this.resources = resources.map((r) => {
        const resWithStatus: ResourceWithStatus = r.enrichedResource.resource;
        resWithStatus.facility = r.facility;
        resWithStatus.status = r.status;
        resWithStatus.resourceTags = r.resourceTags;
        resWithStatus.failureCause = r.failureCause;
        resWithStatus.sourceGroupId = r.sourceGroupId;
        return resWithStatus;
      });
      this.selected.clear();
      this.cachedSubject.next(true);
      this.resourcesToDisable = new Set(
        this.resources
          .filter((resource) => resource.sourceGroupId !== null)
          .map((resource) => resource.id),
      );
      this.setAuthorization();
      this.loading = false;
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  addResource(): void {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = { theme: 'group-theme', group: this.group };

    const dialogRef = this.dialog.open(AddGroupResourceDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  removeResource(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      theme: 'group-theme',
      resources: this.selected.selected,
      groupId: this.group.id,
    };

    const dialogRef = this.dialog.open(RemoveGroupResourceDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }
}
