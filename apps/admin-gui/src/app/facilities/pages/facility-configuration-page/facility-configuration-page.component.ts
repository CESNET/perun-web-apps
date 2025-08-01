import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  Attribute,
  AttributesManagerService,
  FacilitiesManagerService,
  Facility,
  Host,
  RichDestination,
  RoleManagementRules,
  Service,
  ServicesManagerService,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatStepper } from '@angular/material/stepper';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
} from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultDialogConfig, isVirtualAttribute } from '@perun-web-apps/perun/utils';
import { NoServiceDialogComponent } from '../../components/no-service-dialog/no-service-dialog.component';
import { ConfigUnsavedDialogComponent } from '../../components/config-unsaved-dialog/config-unsaved-dialog.component';
import { CancelConfigurationDialogComponent } from '../../components/cancel-configuration-dialog/cancel-configuration-dialog.component';
import { Router } from '@angular/router';
import { UntypedFormControl, Validators } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-facility-configuration-page',
  templateUrl: './facility-configuration-page.component.html',
  styleUrls: ['./facility-configuration-page.component.scss'],
})
export class FacilityConfigurationPageComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;

  processing = false;

  facility: Facility;
  filteredAttributes: Attribute[] = [];
  attSelection = new SelectionModel<Attribute>(
    true,
    [],
    true,
    (attribute1, attribute2) => attribute1.id === attribute2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  services: Service[] = [];
  serviceIds: Set<number> = new Set<number>();
  selection = new SelectionModel<Service>(
    true,
    [],
    true,
    (service1, service2) => service1.id === service2.id,
  );
  hosts: Host[] = [];
  destinations: RichDestination[] = [];
  destinationServiceMissing = false;
  availableRoles: RoleManagementRules[] = [];
  filterValue = '';
  ATTRIBUTES_IDX = 3;
  serviceControl: UntypedFormControl = new UntypedFormControl(false, Validators.requiredTrue);
  attributesControl: UntypedFormControl = new UntypedFormControl(true, Validators.requiredTrue);
  private allowNavigate = false;
  private attributes: Attribute[] = [];
  private attributeIds: Set<number> = new Set<number>();
  private attributesPerService: Map<number, number[]> = new Map<number, number[]>();
  private servicesPerPackage: Map<number, Set<number>> = new Map<number, Set<number>>();
  private saveMsg = '';
  private removeMsg = '';
  private BEFORE_OPTIONAL_IDX = 2;
  private DESTINATIONS_IDX = 4;
  private AFTER_OPTIONAL_IDX = 5;

  constructor(
    private attributesManager: AttributesManagerService,
    private serviceManager: ServicesManagerService,
    private facilityService: FacilitiesManagerService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private router: Router,
    private guiAuthResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
  ) {
    this.translate
      .get('FACILITY_CONFIGURATION.ATT_SAVED')
      .subscribe((value: string) => (this.saveMsg = value));
    this.translate
      .get('FACILITY_CONFIGURATION.ATT_REMOVED')
      .subscribe((value: string) => (this.removeMsg = value));
  }

  ngOnInit(): void {
    this.facility = this.entityStorageService.getEntity();
    this.guiAuthResolver.assignAvailableRoles(this.availableRoles, 'Facility');
    this.serviceManager.getServices().subscribe((services) => {
      this.services = services;
    });
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
    this.attSelection.changed.subscribe(() => {
      this.attributesControl.setValue(this.attSelection.selected.length === 0);
    });
  }

  onCancel(): void {
    const config = getDefaultDialogConfig();
    config.width = '550px';
    config.data = {
      facilityId: this.facility.id,
      lastStep: this.stepper.selectedIndex === this.stepper.steps.length - 1,
      theme: 'facility-theme',
    };
    const dialogRef = this.dialog.open(CancelConfigurationDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.allowNavigate = true;
        sessionStorage.removeItem('newFacilityId');
        void this.router.navigate(['facilities'], { queryParamsHandling: 'merge' });
      }
    });
  }

  singleServiceSelected(): void {
    this.setServiceControl();
    if (this.processing) {
      return;
    }
  }

  back(): void {
    if (this.stepper.selectedIndex <= this.BEFORE_OPTIONAL_IDX) {
      this.setServiceControl();
    }

    if (
      this.stepper.selectedIndex === this.AFTER_OPTIONAL_IDX &&
      this.selection.selected.length === 0
    ) {
      this.stepper.selectedIndex = this.BEFORE_OPTIONAL_IDX;
    } else {
      this.stepper.previous();
    }
  }

  onSaveAttributes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.processing = true;
      this.attributesManager
        .setFacilityAttributes({
          facility: this.facility.id,
          attributes: this.attSelection.selected,
        })
        .subscribe({
          next: () => {
            this.notificator.showSuccess(this.saveMsg);
            this.attSelection.clear();
            this.cachedSubject.next(true);
            this.processing = false;
            resolve();
          },
          error: () => {
            this.processing = false;
            reject();
          },
        });
    });
  }

  next(): void {
    this.checkDestinationDependency(this.stepper.selectedIndex);

    if (this.stepper.selectedIndex === this.BEFORE_OPTIONAL_IDX) {
      // skip optional steps when no service is selected
      if (this.selection.selected.length === 0) {
        this.openSkipDialog();
      } else {
        this.getRequiredAttributes();
        this.stepper.next();
      }
    } else if (this.stepper.selectedIndex === this.ATTRIBUTES_IDX) {
      // notify user about unsaved attributes
      if (this.attSelection.selected.length !== 0) {
        this.openUnsavedAttsDialog();
      } else {
        this.stepper.next();
      }
    } else {
      this.stepper.next();
    }
  }

  onFinish(): void {
    this.allowNavigate = true;
    sessionStorage.removeItem('newFacilityId');
    void this.router.navigate(['facilities', this.facility.id], { queryParamsHandling: 'merge' });
  }

  onRemoveAttributes(): void {
    this.processing = true;
    const ids = this.attSelection.selected.map((att) => att.id);
    this.attributesManager.removeFacilityAttributes(this.facility.id, ids).subscribe({
      next: () => {
        this.notificator.showSuccess(this.removeMsg);
        this.attSelection.clear();
        this.cachedSubject.next(true);
        this.getRequiredAttributes();
        this.processing = false;
      },
      error: () => (this.processing = false),
    });
  }

  filterAttributes(services: Service[]): void {
    if (services === undefined || services.length === 0) {
      this.filteredAttributes = this.attributes;
      return;
    }

    const attIds: Set<number> = new Set<number>();
    for (const service of services) {
      this.attributesPerService.get(service.id).forEach((id) => attIds.add(id));
    }
    this.filteredAttributes = [];
    for (const att of this.attributes) {
      if (attIds.has(att.id)) {
        this.filteredAttributes.push(att);
      }
    }

    this.attSelection.clear();
    this.cachedSubject.next(true);
  }

  getNonEmptyAttributes(): void {
    this.filteredAttributes = this.attributes.filter((att) => {
      if (!!att.value && (!Array.isArray(att.value) || att.value.length !== 0)) {
        return att;
      }
    });
  }

  navigationStep(event: StepperSelectionEvent): void {
    this.checkDestinationDependency(event.previouslySelectedIndex);

    if (event.selectedIndex === this.ATTRIBUTES_IDX) {
      this.getRequiredAttributes();
    } else if (event.selectedIndex === this.DESTINATIONS_IDX) {
      this.processing = false;
    } else if (event.selectedIndex <= this.BEFORE_OPTIONAL_IDX) {
      this.setServiceControl();
    }
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.selection.clear();
    this.cachedSubject.next(true);
  }

  canDeactivate(): boolean {
    if (!this.allowNavigate) {
      this.onCancel();
    }

    return this.allowNavigate;
  }

  private getServiceRequiredAttributes(services: Service[], idx: number): void {
    if (idx === services.length) {
      return;
    } else {
      this.attributesManager
        .getRequiredAttributesDefinition(services[idx].id)
        .subscribe((reqAtts) => {
          reqAtts = reqAtts.filter((reqAtt) => this.attributeIds.has(reqAtt.id));
          this.attributesPerService.set(
            services[idx].id,
            reqAtts.map((att) => att.id),
          );
          this.getServiceRequiredAttributes(services, idx + 1);
        });
    }
  }

  private setServiceControl(): void {
    this.serviceControl.setValue(this.selection.selected.length !== 0);
  }

  private openSkipDialog(): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = { theme: 'facility-theme' };
    const dialogRef = this.dialog.open(NoServiceDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.serviceControl.setValue(true);
        this.stepper.selectedIndex = this.AFTER_OPTIONAL_IDX;
      }
    });
  }

  private getRequiredAttributes(): void {
    this.processing = true;
    this.attributesManager
      .getRequiredAttributesFacilityServices(
        this.selection.selected.map((service) => service.id),
        this.facility.id,
      )
      .subscribe((attributes) => {
        this.attSelection.clear();
        this.attributes = attributes.filter((att) => !isVirtualAttribute(att));
        this.filteredAttributes = this.attributes;
        this.attributes.forEach((att) => this.attributeIds.add(att.id));
        this.getServiceRequiredAttributes(this.selection.selected, 0);
        this.processing = false;
      });
  }

  private openUnsavedAttsDialog(): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = { theme: 'facility-theme' };
    const dialogRef = this.dialog.open(ConfigUnsavedDialogComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSaveAttributes().then(
          () => {
            this.stepper.next();
          },
          () => this.getRequiredAttributes(),
        );
      }
    });
  }

  private checkDestinationDependency(idx: number): void {
    if (idx === this.BEFORE_OPTIONAL_IDX || idx === this.DESTINATIONS_IDX) {
      this.serviceIds = new Set<number>([...this.selection.selected.map((service) => service.id)]);
      this.destinationServicePresent();
    }
  }

  private destinationServicePresent(): void {
    for (const dest of this.destinations) {
      if (!this.serviceIds.has(dest.service.id)) {
        this.destinationServiceMissing = true;
        return;
      }
    }
    this.destinationServiceMissing = false;
  }
}
