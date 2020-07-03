import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { openClose } from '@perun-web-apps/perun/animations';
import { FacilitiesManagerService, ServicesManagerService } from '@perun-web-apps/perun/openapi';
let AddServicesDestinationDialogComponent = class AddServicesDestinationDialogComponent {
    constructor(dialogRef, data, facilitiesManager, servicesManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.facilitiesManager = facilitiesManager;
        this.servicesManager = servicesManager;
        this.services = [];
        this.types = ['host', 'user@host', 'user@host:port', 'user@host-windows', 'host-windows-proxy',
            'url', 'mail', 'semail', 'service-specific'];
        this.selectedType = 'host';
        this.propagations = ['PARALLEL', 'DUMMY'];
        this.selectedPropagation = 'PARALLEL';
        this.destination = '';
        this.useFacilityHost = false;
        this.invalidNotification = '';
    }
    ngOnInit() {
        this.facilitiesManager.getHosts(this.data.facility.id).subscribe(hosts => {
            this.hosts = hosts;
            this.servicesOnFacility = true;
            this.getServices();
        });
    }
    onCancel() {
        this.dialogRef.close();
    }
    onSubmit() {
        // @ts-ignore
        if (this.selectedService === 'all') {
            if (this.useFacilityHost) {
                this.servicesManager.addDestinationsDefinedByHostsOnFacilityWithListOfServiceAndFacility({ services: this.services, facility: this.data.facility.id }).subscribe(destination => {
                    this.dialogRef.close(true);
                });
            }
            else {
                this.servicesManager.addDestinationToMultipleServices({ services: this.services, facility: this.data.facility.id,
                    destination: this.destination, type: this.selectedType,
                    propagationType: this.selectedPropagation }).subscribe(destination => {
                    this.dialogRef.close(true);
                });
            }
        }
        else {
            if (this.useFacilityHost) {
                this.servicesManager.addDestinationsDefinedByHostsOnFacilityWithServiceAndFacility(this.selectedService.id, this.data.facility.id).subscribe(destination => {
                    this.dialogRef.close(true);
                });
            }
            else {
                this.servicesManager.addDestination(this.selectedService.id, this.data.facility.id, this.destination, this.selectedType, this.selectedPropagation).subscribe(destination => {
                    this.dialogRef.close(true);
                });
            }
        }
    }
    getServices() {
        if (this.servicesOnFacility) {
            this.servicesManager.getAssignedServices(this.data.facility.id).subscribe(services => {
                this.services = services;
            });
        }
        else {
            this.servicesManager.getServices().subscribe(services => {
                this.services = services;
            });
        }
        this.selectedService = undefined;
    }
    getTypeForView(type) {
        if (type === 'semail') {
            return 'Send Mail';
        }
        if (type === 'service-specific') {
            return 'Service Specific';
        }
        return type;
    }
    isInvalid() {
        // @ts-ignore
        if (this.selectedService === 'noService') {
            this.invalidNotification = 'NO_SERVICE';
            return true;
        }
        // @ts-ignore
        if (this.selectedService === undefined) {
            this.invalidNotification = 'CHOOSE_SERVICE';
            return true;
        }
        if (this.destination === '' && !this.useFacilityHost) {
            this.invalidNotification = 'REQUIRED_FIELD';
            return true;
        }
        if (this.selectedType === 'mail' || this.selectedType === 'semail') {
            const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!regexp.test(this.destination)) {
                this.invalidNotification = 'TYPE_EMAIL';
                return true;
            }
        }
        return false;
    }
};
AddServicesDestinationDialogComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-add-services-destination-dialog',
        templateUrl: './add-services-destination-dialog.component.html',
        styleUrls: ['./add-services-destination-dialog.component.scss'],
        animations: [
            openClose
        ]
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, FacilitiesManagerService,
        ServicesManagerService])
], AddServicesDestinationDialogComponent);
export { AddServicesDestinationDialogComponent };
//# sourceMappingURL=add-services-destination-dialog.component.js.map