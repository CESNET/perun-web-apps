import { AfterViewChecked, Component, DestroyRef, HostBinding, OnInit } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { EnrichedFacility, FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig, getRecentlyVisitedIds } from '@perun-web-apps/perun/utils';
import { TABLE_FACILITY_SELECT } from '@perun-web-apps/config/table-config';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { CreateFacilityDialogComponent } from '../../../shared/components/dialogs/create-facility-dialog/create-facility-dialog.component';
import { DeleteFacilityDialogComponent } from '../../../shared/components/dialogs/delete-facility-dialog/delete-facility-dialog.component';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { CacheHelperService } from '../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-facility-select-page',
  templateUrl: './facility-select-page.component.html',
  styleUrls: ['./facility-select-page.component.scss'],
})
export class FacilitySelectPageComponent implements OnInit, AfterViewChecked {
  static id = 'FacilitySelectPageComponent';

  @HostBinding('class.router-component') true;

  facilities: EnrichedFacility[] = [];
  recentIds: number[] = [];
  loading: boolean;
  createAuth: boolean;
  deleteAuth: boolean;
  filterValue = '';
  tableId = TABLE_FACILITY_SELECT;
  selection = new SelectionModel<EnrichedFacility>(
    false,
    [],
    true,
    (enrichedFacility1, enrichedFacility2) =>
      enrichedFacility1.facility.id === enrichedFacility2.facility.id,
  );
  cachedSubject = new BehaviorSubject(true);

  constructor(
    private facilityManager: FacilitiesManagerService,
    private sideMenuService: SideMenuService,
    private guiAuthResolver: GuiAuthResolver,
    private dialog: MatDialog,
    private cacheHelperService: CacheHelperService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.createAuth = this.guiAuthResolver.isAuthorized('createFacility_Facility_policy', []);
    this.deleteAuth = this.guiAuthResolver.isFacilityAdmin();
    this.refreshTable();

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === FacilitySelectPageComponent.id) {
          this.refreshTable();
        }
      });
  }

  ngAfterViewChecked(): void {
    this.sideMenuService.setFacilityMenuItems([]);
  }

  refreshTable(): void {
    this.loading = true;
    this.facilityManager.getEnrichedFacilities().subscribe((facilities) => {
      this.selection.clear();
      this.cachedSubject.next(true);
      this.facilities = facilities;
      this.recentIds = getRecentlyVisitedIds('facilities');
      this.loading = false;
    });
  }

  onCreate(): void {
    const config = getDefaultDialogConfig();
    config.width = '800px';
    config.data = {
      theme: 'facility-theme',
    };

    const dialogRef = this.dialog.open(CreateFacilityDialogComponent, config);

    dialogRef.afterClosed().subscribe((facilityCreated) => {
      if (facilityCreated) {
        this.loading = true;
        this.refreshTable();
      }
    });
  }

  onDelete(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      theme: 'facility-theme',
      facility: this.selection.selected[0].facility,
    };
    const dialogRef = this.dialog.open(DeleteFacilityDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }
}
