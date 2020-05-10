import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { openClose } from '../../../animations/Animations';
import {
  DestinationPropagationType,
  DestinationType,
  FacilitiesManagerService,
  Facility,
  Host,
  Service,
  ServicesManagerService
} from '@perun-web-apps/perun/openapi';

export interface  AddServicesDestinationDialogData {
  facility: Facility;
  theme: string;
}

@Component({
  selector: 'app-perun-web-apps-add-services-destination-dialog',
  templateUrl: './add-services-destination-dialog.component.html',
  styleUrls: ['./add-services-destination-dialog.component.scss'],
  animations: [
    openClose
  ]
})
export class AddServicesDestinationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddServicesDestinationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data:  AddServicesDestinationDialogData,
              public facilitiesManager: FacilitiesManagerService,
              public servicesManager: ServicesManagerService) { }


  hosts: Host[];
  servicesOnFacility: boolean;
  services: Service[] = [];
  selectedService: Service;
  types: string[] = ['host', 'user@host', 'user@host:port','user@host-windows', 'host-windows-proxy',
    'url', 'mail', 'semail', 'service-specific'];
  selectedType = 'host';
  propagations: string[] = ['PARALLEL', 'DUMMY'];
  selectedPropagation  = 'PARALLEL';
  destination = '';
  useFacilityHost = false;
  invalidNotification = '';

  ngOnInit() {
    this.facilitiesManager.getHosts(this.data.facility.id).subscribe( hosts => {
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
        this.servicesManager.addDestinationsDefinedByHostsOnFacilityWithListOfServiceAndFacility(
          {services: this.services, facility: this.data.facility.id}).subscribe( destination => {
          this.dialogRef.close(true);
        });
      }
      else {
        this.servicesManager.addDestinationToMultipleServices({services: this.services, facility: this.data.facility.id,
        destination: this.destination, type: this.selectedType as DestinationType,
          propagationType: this.selectedPropagation as DestinationPropagationType}).subscribe( destination => {
          this.dialogRef.close(true);
        });
      }
    } else {
      if (this.useFacilityHost) {
        this.servicesManager.addDestinationsDefinedByHostsOnFacilityWithServiceAndFacility(
          this.selectedService.id, this.data.facility.id
        ).subscribe( destination => {
          this.dialogRef.close(true);
        });
      }
      else {
        this.servicesManager.addDestination(this.selectedService.id, this.data.facility.id,
          this.destination, this.selectedType as DestinationType,
          this.selectedPropagation as DestinationPropagationType).subscribe( destination => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  getServices() {
    if (this.servicesOnFacility) {
      this.servicesManager.getAssignedServices(this.data.facility.id).subscribe( services => {
        this.services = services;

      });
    } else {
      this.servicesManager.getServices().subscribe( services => {
        this.services = services;
      })
    }
    this.selectedService = undefined;
  }

  getTypeForView(type: string) {
    if (type === 'semail') {
      return 'Send Mail';
    }
    if (type === 'service-specific') {
      return 'Service Specific';
    }
    return type;
  }

  isInvalid():boolean {
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
    if (this.selectedType === 'mail'|| this.selectedType === 'semail') {
      const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if (!regexp.test(this.destination)) {
        this.invalidNotification = 'TYPE_EMAIL';
        return true;
      }
    }
    return false;
  }
}
