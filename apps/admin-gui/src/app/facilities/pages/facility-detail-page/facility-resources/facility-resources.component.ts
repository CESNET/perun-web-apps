import { TranslateModule } from '@ngx-translate/core';
import {
  DebounceFilterComponent,
  RefreshButtonComponent,
  ResourcesListComponent,
} from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { RemoveResourceDialogComponent } from '../../../../shared/components/dialogs/remove-resource-dialog/remove-resource-dialog.component';
import {
  FacilitiesManagerService,
  Facility,
  RichResource,
  Service,
  ServicesManagerService,
} from '@perun-web-apps/perun/openapi';
import { CreateResourceDialogComponent } from '../../../../shared/components/dialogs/create-resource-dialog/create-resource-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { ServiceSearchSelectComponent } from '@perun-web-apps/perun/components';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    ServiceSearchSelectComponent,
    LoadingTableComponent,
    ResourcesListComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-facility-resources',
  templateUrl: './facility-resources.component.html',
  styleUrls: ['./facility-resources.component.scss'],
})
export class FacilityResourcesComponent implements OnInit, AfterViewInit {
  static id = 'FacilityResourcesComponent';

  // class used for animation
  @HostBinding('class.router-component') true;

  facility: Facility;
  resources: RichResource[] = [];
  selected = new SelectionModel<RichResource>(
    true,
    [],
    true,
    (richResource1, richResource2) => richResource1.id === richResource2.id,
  );
  cachedSubject = new BehaviorSubject(true);

  emptyService: Service = { id: -1, beanName: 'Service', name: 'All' };
  services: Service[] = [this.emptyService];
  selectedService: Service = this.emptyService;

  filterValue = '';

  loading: boolean;
  displayedColumns = ['id', 'vo', 'facility', 'description'];

  addAuth: boolean;
  removeAuth: boolean;
  routeAuth: boolean;

  constructor(
    private dialog: MatDialog,
    private facilitiesManager: FacilitiesManagerService,
    private servicesManager: ServicesManagerService,
    private authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
    private cd: ChangeDetectorRef,
    private cacheHelperService: CacheHelperService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.facility = this.entityStorageService.getEntity();
    this.setAuthRights();
    this.servicesManager.getAssignedServices(this.facility.id).subscribe((services) => {
      this.services = [this.emptyService].concat(services);
      this.refreshTable();
    });
    this.loadResourcesForFacility();

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === FacilityResourcesComponent.id) {
          this.refreshTable();
        }
      });
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  removeResource(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = { theme: 'facility-theme', resources: this.selected.selected };

    const dialogRef = this.dialog.open(RemoveResourceDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable(): void {
    this.loading = true;
    if (this.selectedService.id === -1) {
      this.loadResourcesForFacility();
    } else {
      this.facilitiesManager
        .getAssignedRichResourcesForFacilityAndService(this.facility.id, this.selectedService.id)
        .subscribe((resources) => {
          this.resources = resources;
          this.selected.clear();
          this.cachedSubject.next(true);
          this.setAuthRights();
          this.loading = false;
        });
    }
  }

  setAuthRights(): void {
    this.addAuth = this.authResolver.isAuthorized('createResource_Resource_Vo_Facility_policy', [
      this.facility,
    ]);

    this.removeAuth = this.authResolver.isAuthorized('deleteResource_Resource_policy', [
      this.facility,
    ]);
    this.displayedColumns = this.removeAuth
      ? ['select', 'id', 'name', 'vo', 'description']
      : ['id', 'name', 'vo', 'description'];

    if (this.resources.length !== 0) {
      this.routeAuth = this.authResolver.isAuthorized('getRichResourceById_int_policy', [
        this.facility,
        this.resources[0],
      ]);
    }
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  createResource(): void {
    const config = getDefaultDialogConfig();
    config.width = '1350px';
    config.data = { facilityId: this.facility.id, theme: 'facility-theme' };

    const dialogRef = this.dialog.open(CreateResourceDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  serviceSelected(service: Service): void {
    this.selectedService = service;
    this.refreshTable();
  }

  private loadResourcesForFacility(): void {
    this.facilitiesManager
      .getAssignedRichResourcesForFacility(this.facility.id)
      .subscribe((resources) => {
        this.resources = resources;
        this.selected.clear();
        this.cachedSubject.next(true);
        this.setAuthRights();
        this.loading = false;
      });
  }
}
