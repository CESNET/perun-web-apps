import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FacilitiesManagerService,
  Facility, RichDestination,
  RichResource,
  ServicesManagerService
} from '@perun-web-apps/perun/openapi';
import {
  TABLE_FACILITY_SERVICES_DESTINATION_LIST,
  TableConfigService
} from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { RemoveDestinationDialogComponent } from '../../../../shared/components/dialogs/remove-destination-dialog/remove-destination-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { AddServicesDestinationDialogComponent } from '../../../../shared/components/dialogs/add-services-destination-dialog/add-services-destination-dialog.component';

@Component({
  selector: 'app-perun-web-apps-facility-services-destinations',
  templateUrl: './facility-services-destinations.component.html',
  styleUrls: ['./facility-services-destinations.component.scss']
})
export class FacilityServicesDestinationsComponent implements OnInit {

  static id = 'FacilityServicesDestinationsComponent';

  // class used for animation
  @HostBinding('class.router-component') true;

  constructor(private dialog: MatDialog,
              private facilitiesManager: FacilitiesManagerService,
              private servicesManager: ServicesManagerService,
              private tableConfigService: TableConfigService,
              private translate: TranslateService,
              private notificator: NotificatorService,
              private route: ActivatedRoute) { }

  facility: Facility;
  destinations: RichDestination[];
  selected = new SelectionModel<RichResource>(true, []);
  displayedColumns: string[] = ['select', 'destinationId', 'service', 'destination', 'type', 'propagationType'];

  filterValue = '';

  loading: boolean;
  pageSize: number;
  tableId = TABLE_FACILITY_SERVICES_DESTINATION_LIST;

  ngOnInit() {

    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.loading = true;
    this.route.parent.params.subscribe(parentParams => {
      const facilityId = parentParams['facilityId'];

      this.facilitiesManager.getFacilityById(facilityId).subscribe(facility => {
        this.facility = facility;

        this.refreshTable();
      });
    });
  }

  refreshTable() {
    this.loading = true;
    this.servicesManager.getAllRichDestinationsForFacility(this.facility.id).subscribe( destinations => {
      this.destinations = destinations;
      this.selected.clear();
      this.loading = false;
    });
  }

  addDestination() {
    const dialogRef = this.dialog.open(AddServicesDestinationDialogComponent, {
      width: '600px',
      data: {facility: this.facility, theme: 'facility-theme'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.translate.get('FACILITY_DETAIL.SERVICES_DESTINATIONS.ADD_SUCCESS').subscribe(successMessage => {
          this.refreshTable();
          this.notificator.showSuccess(successMessage);
        });
      }
    });
  }

  removeDestination() {
    const dialogRef = this.dialog.open(RemoveDestinationDialogComponent, {
      width: '600px',
      data: {destinations: this.selected.selected, theme: 'facility-theme'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.deleteDestinations(this.selected.selected);
      }
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  pageChanged(event: PageEvent) {
    console.log(event.pageSize);
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }

  deleteDestinations(destinationsForDelete: RichDestination[]) {
    if (destinationsForDelete.length === 0) {
      this.translate.get('FACILITY_DETAIL.SERVICES_DESTINATIONS.REMOVE_SUCCESS').subscribe(successMessage => {
        this.refreshTable();
        this.notificator.showSuccess(successMessage);
      });
    } else {
      const destination = destinationsForDelete[0];
      this.servicesManager.removeDestination(destination.service.id,
                                            destination.facility.id,
                                            destination.destination,
                                            destination.type).subscribe( () => {
        destinationsForDelete.shift();
        this.deleteDestinations(destinationsForDelete);
      });
    }
  }
}
