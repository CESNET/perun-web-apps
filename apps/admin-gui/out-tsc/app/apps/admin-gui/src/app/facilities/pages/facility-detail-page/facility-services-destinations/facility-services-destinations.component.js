import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacilitiesManagerService, ServicesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_FACILITY_SERVICES_DESTINATION_LIST, TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { RemoveDestinationDialogComponent } from '../../../../shared/components/dialogs/remove-destination-dialog/remove-destination-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { AddServicesDestinationDialogComponent } from '../../../../shared/components/dialogs/add-services-destination-dialog/add-services-destination-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let FacilityServicesDestinationsComponent = class FacilityServicesDestinationsComponent {
    constructor(dialog, facilitiesManager, servicesManager, tableConfigService, translate, notificator, route) {
        this.dialog = dialog;
        this.facilitiesManager = facilitiesManager;
        this.servicesManager = servicesManager;
        this.tableConfigService = tableConfigService;
        this.translate = translate;
        this.notificator = notificator;
        this.route = route;
        this.selected = new SelectionModel(true, []);
        this.displayedColumns = ['select', 'destinationId', 'service', 'destination', 'type', 'propagationType'];
        this.filterValue = '';
        this.tableId = TABLE_FACILITY_SERVICES_DESTINATION_LIST;
    }
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
        this.servicesManager.getAllRichDestinationsForFacility(this.facility.id).subscribe(destinations => {
            this.destinations = destinations;
            this.selected.clear();
            this.loading = false;
        });
    }
    addDestination() {
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.data = { facility: this.facility, theme: 'facility-theme' };
        const dialogRef = this.dialog.open(AddServicesDestinationDialogComponent, config);
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
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.data = { destinations: this.selected.selected, theme: 'facility-theme' };
        const dialogRef = this.dialog.open(RemoveDestinationDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.deleteDestinations(this.selected.selected);
            }
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    pageChanged(event) {
        console.log(event.pageSize);
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
    deleteDestinations(destinationsForDelete) {
        if (destinationsForDelete.length === 0) {
            this.translate.get('FACILITY_DETAIL.SERVICES_DESTINATIONS.REMOVE_SUCCESS').subscribe(successMessage => {
                this.refreshTable();
                this.notificator.showSuccess(successMessage);
            });
        }
        else {
            const destination = destinationsForDelete[0];
            this.servicesManager.removeDestination(destination.service.id, destination.facility.id, destination.destination, destination.type).subscribe(() => {
                destinationsForDelete.shift();
                this.deleteDestinations(destinationsForDelete);
            });
        }
    }
};
FacilityServicesDestinationsComponent.id = 'FacilityServicesDestinationsComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], FacilityServicesDestinationsComponent.prototype, "true", void 0);
FacilityServicesDestinationsComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-facility-services-destinations',
        templateUrl: './facility-services-destinations.component.html',
        styleUrls: ['./facility-services-destinations.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        FacilitiesManagerService,
        ServicesManagerService,
        TableConfigService,
        TranslateService,
        NotificatorService,
        ActivatedRoute])
], FacilityServicesDestinationsComponent);
export { FacilityServicesDestinationsComponent };
//# sourceMappingURL=facility-services-destinations.component.js.map