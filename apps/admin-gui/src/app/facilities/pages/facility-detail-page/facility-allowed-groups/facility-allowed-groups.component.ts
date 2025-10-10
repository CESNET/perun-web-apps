import { TranslateModule } from '@ngx-translate/core';
import {
  DebounceFilterComponent,
  GroupsListComponent,
  RefreshButtonComponent,
} from '@perun-web-apps/perun/components';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostBinding, Input, OnInit } from '@angular/core';
import { FacilitiesManagerService, Facility, Group, Vo } from '@perun-web-apps/perun/openapi';
import { TABLE_FACILITY_ALLOWED_GROUPS } from '@perun-web-apps/config/table-config';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    GroupsListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-facility-allowed-groups',
  templateUrl: './facility-allowed-groups.component.html',
  styleUrls: ['./facility-allowed-groups.component.scss'],
})
export class FacilityAllowedGroupsComponent implements OnInit {
  static id = 'FacilityAllowedGroupsComponent';

  @Input()
  groups: Group[] = [];

  @HostBinding('class.router-component') true;

  facility: Facility;

  vos: Vo[];

  loading: boolean;

  filterValue = '';

  selected = 'all';

  groupsToShow: Group[] = this.groups;
  tableId = TABLE_FACILITY_ALLOWED_GROUPS;

  groupsWithoutRouteAuth: Set<number> = new Set<number>();

  constructor(
    private facilityManager: FacilitiesManagerService,
    private authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
    private cacheHelperService: CacheHelperService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.facility = this.entityStorageService.getEntity();
    this.facilityManager.getAllowedVos(this.facility.id).subscribe((vos) => {
      this.vos = vos;
      this.refreshTable();
    });

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === FacilityAllowedGroupsComponent.id) {
          this.refreshTable();
        }
      });
  }

  showGroup(): void {
    if (this.selected !== 'all') {
      this.groupsToShow = this.groups.filter((t) => t.voId === parseInt(this.selected, 10));
    } else {
      this.groupsToShow = this.groups;
    }
  }

  refreshTable(): void {
    this.loading = true;
    this.groups = [];
    this.facilityManager.getAllowedGroups(this.facility.id).subscribe((groups) => {
      this.groups = groups;
      this.groupsToShow = this.groups;
      this.setAuthRights(groups);
      this.loading = false;
    });
    if (this.vos && this.vos.length === 0) {
      this.loading = false;
    }
  }

  setAuthRights(groups: Group[]): void {
    groups.forEach((grp) => {
      if (!this.authResolver.isAuthorized('getGroupById_int_policy', [grp])) {
        this.groupsWithoutRouteAuth.add(grp.id);
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }
}
