import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Facility,
  RichDestination,
  Service,
  ServicesManagerService,
} from '@perun-web-apps/perun/openapi';
import { TABLE_FACILITY_SERVICES_DESTINATION_LIST } from '@perun-web-apps/config/table-config';
import { SelectionModel } from '@angular/cdk/collections';
import { RemoveDestinationDialogComponent } from '../../../../shared/components/dialogs/remove-destination-dialog/remove-destination-dialog.component';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
  PerunTranslateService,
} from '@perun-web-apps/perun/services';
import { AddServicesDestinationDialogComponent } from '../../../../shared/components/dialogs/add-services-destination-dialog/add-services-destination-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { BehaviorSubject } from 'rxjs';
import { DestinationListComponent } from '../../../../shared/components/destination-list/destination-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    UiAlertsModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    DestinationListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-perun-web-apps-facility-services-destinations',
  templateUrl: './facility-services-destinations.component.html',
  styleUrls: ['./facility-services-destinations.component.scss'],
})
export class FacilityServicesDestinationsComponent implements OnInit {
  static id = 'FacilityServicesDestinationsComponent';

  // class used for animation
  @HostBinding('class.router-component') true;

  @Input()
  displayedColumns: string[] = [
    'select',
    'destinationId',
    'service',
    'destination',
    'type',
    'status',
    'propagationType',
    'lastSuccessfulPropagation',
    'lastAttemptedPropagation',
  ];
  @Input()
  configServices: Service[] = [];
  @Input()
  configServicesIds: Set<number> = new Set<number>();
  @Input()
  title = 'FACILITY_DETAIL.SERVICES_DESTINATIONS.TITLE';
  @Output()
  destinationEmitter: EventEmitter<RichDestination[]> = new EventEmitter<RichDestination[]>();
  @Input()
  loading: boolean;

  facility: Facility;
  destinations: RichDestination[] = [];
  selected = new SelectionModel<RichDestination>(
    true,
    [],
    true,
    (richDestination1, richDestination2) =>
      richDestination1.id === richDestination2.id &&
      richDestination1.facility?.id === richDestination2.facility?.id &&
      richDestination1.service?.id === richDestination2.service?.id,
  );
  cachedSubject = new BehaviorSubject(true);
  filterValue = '';
  tableId = TABLE_FACILITY_SERVICES_DESTINATION_LIST;

  addAuth: boolean;
  removeAuth: boolean;
  allowAuth: boolean;
  blockAuth: boolean;

  constructor(
    private dialog: MatDialog,
    private servicesManager: ServicesManagerService,
    private translate: PerunTranslateService,
    private notificator: NotificatorService,
    private authResolver: GuiAuthResolver,
    private serviceManager: ServicesManagerService,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.facility = this.entityStorageService.getEntity();
    this.setAuthRights();
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.servicesManager
      .getAllRichDestinationsForFacility(this.facility.id)
      .subscribe((destinations) => {
        this.destinations = destinations;
        this.destinationEmitter.emit(this.destinations);
        this.selected.clear();
        this.cachedSubject.next(true);
        this.setAuthRights();
        this.loading = false;
      });
  }

  setAuthRights(): void {
    this.addAuth = this.authResolver.isAuthorized(
      'addDestination_Service_Facility_Destination_policy',
      [this.facility],
    );
    this.removeAuth = this.authResolver.isAuthorized(
      'removeDestination_Service_Facility_Destination_policy',
      [this.facility],
    );
    this.allowAuth = this.authResolver.isAuthorized(
      'unblockServiceOnDestination_Service_int_policy',
      [this.facility],
    );
    this.blockAuth = this.authResolver.isAuthorized(
      'blockServiceOnDestination_Service_int_policy',
      [this.facility],
    );

    this.displayedColumns = this.removeAuth
      ? this.displayedColumns
      : this.displayedColumns.filter((col) => col !== 'select');
  }

  addDestination(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      facility: this.facility,
      theme: 'facility-theme',
      configServices: this.configServices,
    };

    const dialogRef = this.dialog.open(AddServicesDestinationDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
        this.notificator.showSuccess(
          this.translate.instant('FACILITY_DETAIL.SERVICES_DESTINATIONS.ADD_SUCCESS'),
        );
      }
    });
  }

  removeDestination(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = { destinations: this.selected.selected, theme: 'facility-theme' };

    const dialogRef = this.dialog.open(RemoveDestinationDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  blockServicesOnDestinations(destinations: RichDestination[]): void {
    this.serviceManager.blockServicesOnDestinations({ richDestinations: destinations }).subscribe({
      next: () => {
        this.notificator.showSuccess(
          this.translate.instant('FACILITY_DETAIL.SERVICES_DESTINATIONS.BLOCK_SUCCESS'),
        );
        this.refreshTable();
      },
      error: () => (this.loading = false),
    });
  }

  onBlock(): void {
    this.loading = true;
    this.blockServicesOnDestinations(this.selected.selected);
  }

  allowServicesOnDestinations(destinations: RichDestination[]): void {
    this.serviceManager
      .unblockServicesOnDestinations({ richDestinations: destinations })
      .subscribe({
        next: () => {
          this.notificator.showSuccess(
            this.translate.instant('FACILITY_DETAIL.SERVICES_DESTINATIONS.ALLOW_SUCCESS'),
          );
          this.refreshTable();
        },
        error: () => (this.loading = false),
      });
  }

  onAllow(): void {
    this.loading = true;
    this.allowServicesOnDestinations(this.selected.selected);
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  allSelectedAllowed(): boolean {
    return this.selected.selected.reduce((acc, destination) => acc && !destination.blocked, true);
  }

  allSelectedBlocked(): boolean {
    return this.selected.selected.reduce((acc, destination) => acc && destination.blocked, true);
  }
}
