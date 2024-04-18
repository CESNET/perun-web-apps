import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { TABLE_FACILITY_ALLOWED_USERS } from '@perun-web-apps/config/table-config';
import {
  ConsentStatus,
  ConsentsManagerService,
  FacilitiesManagerService,
  Facility,
  Resource,
  ResourcesManagerService,
  Service,
  ServicesManagerService,
  Vo,
  PaginatedRichUsers,
  UsersOrderColumn,
  UsersManagerService,
  RichUser,
} from '@perun-web-apps/perun/openapi';
import {
  EntityStorageService,
  GuiAuthResolver,
  StoreService,
  PerunTranslateService,
} from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { PageQuery, UserWithConsentStatus } from '@perun-web-apps/perun/models';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import {
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
} from '@perun-web-apps/perun/utils';
import { ExportDataDialogComponent } from '@perun-web-apps/perun/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { userTableColumn } from '@perun-web-apps/perun/components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-facility-allowed-users',
  templateUrl: './facility-allowed-users.component.html',
  styleUrls: ['./facility-allowed-users.component.scss'],
})
export class FacilityAllowedUsersComponent implements OnInit {
  static id = 'FacilityAllowedUsersComponent';

  facility: Facility;
  attributes: string[] = [];

  searchString = '';
  selection = new SelectionModel<RichUser>(true, []);
  nextPage = new BehaviorSubject<PageQuery>({});
  usersPage$: Observable<PaginatedRichUsers> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.userManager.getUsersPage({
        attrNames: this.attributes,
        query: {
          order: pageQuery.order,
          pageSize: pageQuery.pageSize,
          offset: pageQuery.offset,
          sortColumn: pageQuery.sortColumn as UsersOrderColumn,
          onlyAllowed: this.showAllowed,
          consentStatuses: this.selectedConsentStatuses,
          searchString: pageQuery.searchString,
          facilityId: this.facility.id,
          resourceId: this.selectedResource?.id,
          serviceId: this.selectedService?.id,
          voId: this.selectedVo?.id,
        },
      }),
    ),
    tap(() => {
      this.selection.clear();
      setTimeout(() => this.loadingSubject$.next(false), 200);
    }),
    startWith({ data: [], totalCount: 0, offset: 0, pageSize: 0 }),
  );
  loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );

  showAllowed = true;
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  selectedResource: Resource;

  vos: Vo[] = [];
  selectedVo: Vo;

  services: Service[] = [];
  filteredServices: Service[] = [];
  selectedService: Service;

  globalForceConsents: boolean;
  facilityForceConsents: boolean;
  consentStatusesList = ['UNSIGNED', 'GRANTED', 'REVOKED'];
  selectedConsentStatuses: ConsentStatus[] = [];
  consentStatuses: FormControl<ConsentStatus[]>;

  forceConsentsDisplayColumns: userTableColumn[] = [
    'id',
    'name',
    'email',
    'logins',
    'organization',
    'consentStatus',
  ];
  displayedColumns: userTableColumn[] = ['id', 'name', 'email', 'logins', 'organization'];

  tableId = TABLE_FACILITY_ALLOWED_USERS;

  routeAuth: boolean;
  toggle_messages: string[] = [
    'FACILITY_DETAIL.ALLOWED_USERS.FILTER_ASSIGNED_MSG',
    'FACILITY_DETAIL.ALLOWED_USERS.FILTER_ALLOWED_MSG',
  ];

  advancedFilter = false;
  filtersCount: number;

  constructor(
    private facilityService: FacilitiesManagerService,
    private serviceService: ServicesManagerService,
    private resourceService: ResourcesManagerService,
    private authResolver: GuiAuthResolver,
    private storeService: StoreService,
    private entityStorageService: EntityStorageService,
    private consentService: ConsentsManagerService,
    private translate: PerunTranslateService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private cacheHelperService: CacheHelperService,
    private userManager: UsersManagerService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.consentStatuses = new FormControl<ConsentStatus[]>(this.selectedConsentStatuses);
    this.attributes = [Urns.USER_DEF_ORGANIZATION, Urns.USER_DEF_PREFERRED_MAIL];
    this.attributes = this.attributes.concat(this.storeService.getLoginAttributeNames());

    this.facility = this.entityStorageService.getEntity();
    this.globalForceConsents = this.storeService.getProperty('enforce_consents');
    this.consentService.getConsentHubByFacility(this.facility.id).subscribe((hub) => {
      this.facilityForceConsents = hub.enforceConsents;
      // Add new table header, when force consents are enabled
      if (this.globalForceConsents && this.facilityForceConsents) {
        this.displayedColumns = this.forceConsentsDisplayColumns;
      }
    });

    this.routeAuth = this.authResolver.isPerunAdminOrObserver();
    this.loadFilters();
    this.changeFilter();

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === FacilityAllowedUsersComponent.id) {
          this.refresh();
        }
      });
  }

  changeFilter(): void {
    this.filtersCount = this.showAllowed ? 1 : 0;
    if (this.selectedVo) {
      this.filtersCount += 1;
    }
    if (this.selectedResource) {
      this.filtersCount += 1;
    }
    if (this.selectedService) {
      this.filtersCount += 1;
    }
    if (this.selectedConsentStatuses.length > 0) {
      this.filtersCount += 1;
    }
    this.cd.detectChanges();
    this.refresh();
  }

  clearFilters(): void {
    // Save opened filter to refresh inputs (hacky way)
    const openedFilter = this.advancedFilter;
    this.advancedFilter = false;
    this.showAllowed = false;
    this.selectedVo = undefined;
    this.selectedResource = undefined;
    this.selectedService = undefined;
    this.selectedConsentStatuses = [];
    this.consentStatuses.setValue(this.selectedConsentStatuses);
    this.filtersCount = 0;
    this.voSelected(this.selectedVo);
    this.resourceSelected(this.selectedResource);
    this.serviceSelected(this.selectedService);
    this.cd.detectChanges();
    this.advancedFilter = openedFilter;
  }

  loadFilters(): void {
    this.facilityService.getAllowedVos(this.facility.id).subscribe((vos) => {
      this.vos = vos;

      this.facilityService
        .getAssignedResourcesForFacility(this.facility.id)
        .subscribe((resources) => {
          this.resources = resources;
          this.filteredResources = this.resources;
          if (this.selectedVo) {
            this.filteredResources = this.resources.filter(
              (res) => res.voId === this.selectedVo.id,
            );
          }
        });

      this.serviceService.getAssignedServices(this.facility.id).subscribe((services) => {
        this.services = services;
        if (this.selectedResource) {
          this.resourceService
            .getAssignedServicesToResource(this.selectedResource.id)
            .subscribe((assignedServices) => {
              this.filteredServices = assignedServices;
            });
        }
        this.cd.detectChanges();
      });
    });
  }

  refresh(): void {
    this.loadFilters();
    this.nextPage.next(this.nextPage.value);
  }

  applyFilter(filterValue: string): void {
    this.searchString = filterValue;
    this.refresh();
  }

  voSelected(vo: Vo): void {
    this.selectedVo = vo;
    this.selectedResource = undefined;
    this.selectedService = undefined;
    this.changeFilter();
  }

  resourceSelected(resource: Resource): void {
    this.selectedResource = resource;
    this.services = [];
    this.filteredServices = [];
    this.selectedService = null;
    this.changeFilter();
  }

  serviceSelected(service: Service): void {
    this.selectedService = service;
    this.changeFilter();
  }

  consentStatusSelected(): void {
    this.selectedConsentStatuses = this.consentStatuses.value;
    this.changeFilter();
  }

  displaySelectedStatuses(): string {
    if (this.selectedConsentStatuses.length === this.consentStatusesList.length) {
      return 'ALL';
    }
    const statuses: string[] = this.consentStatuses.value;
    if (statuses) {
      const translatedStatus = this.translate.instant('CONSENTS.STATUS_' + statuses[0]);
      return `${translatedStatus}  ${
        statuses.length > 1
          ? '(+' +
            (statuses.length - 1).toString() +
            ' ' +
            (statuses.length === 2 ? 'other)' : 'others)')
          : ''
      }`;
    }
    return '';
  }

  downloadAll(a: {
    format: string;
    length: number;
    getDataForColumnFun: (data: RichUser, column: string) => string;
    convertToExport?: (data: RichUser[]) => UserWithConsentStatus[] | RichUser[];
  }): void {
    const query = this.nextPage.getValue();

    const config = getDefaultDialogConfig();
    config.width = '300px';
    const exportLoading = this.dialog.open(ExportDataDialogComponent, config);

    this.userManager
      .getUsersPage({
        attrNames: this.attributes,
        query: {
          order: query.order,
          pageSize: a.length,
          offset: 0,
          sortColumn: query.sortColumn as UsersOrderColumn,
          searchString: query.searchString,
          onlyAllowed: this.showAllowed,
          consentStatuses: this.selectedConsentStatuses,
          facilityId: this.facility.id,
          resourceId: this.selectedResource?.id,
          serviceId: this.selectedService?.id,
          voId: this.selectedVo?.id,
        },
      })
      .subscribe({
        next: (paginatedUsers) => {
          exportLoading.close();
          downloadData(
            getDataForExport(
              a.convertToExport(paginatedUsers.data),
              this.displayedColumns,
              a.getDataForColumnFun,
            ),
            a.format,
          );
        },
      });
  }
}
