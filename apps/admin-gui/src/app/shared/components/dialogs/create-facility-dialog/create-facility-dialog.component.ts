import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacilitiesManagerService, Facility } from '@perun-web-apps/perun/openapi';
import { EntityStorageService, NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface CreateFacilityDialogData {
  theme: string;
}

@Component({
  selector: 'app-create-facility-dialog',
  templateUrl: './create-facility-dialog.component.html',
  styleUrls: ['./create-facility-dialog.component.scss'],
})
export class CreateFacilityDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<CreateFacilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CreateFacilityDialogData,
    public facilitiesManager: FacilitiesManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private router: Router,
    private entityStorageService: EntityStorageService
  ) {}

  theme: string;
  nameControl = new FormControl('', [Validators.required]);
  descControl = new FormControl('');
  facilities: Facility[];
  srcFacility: Facility = null;
  configure = false;
  loading = false;

  ngOnInit(): void {
    this.theme = this.data.theme;

    this.loading = true;
    this.facilitiesManager.getAllFacilities().subscribe(
      (facilities) => {
        this.facilities = facilities;
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  copyFacilitySettings(destFacility: number) {
    this.facilitiesManager.copyAttributes(this.srcFacility.id, destFacility).subscribe(
      () => {
        this.facilitiesManager.copyManagers(this.srcFacility.id, destFacility).subscribe(
          () => {
            this.facilitiesManager.copyOwners(this.srcFacility.id, destFacility).subscribe(
              () => {
                this.handleSuccess(destFacility);
              },
              () => (this.loading = false)
            );
          },
          () => (this.loading = false)
        );
      },
      () => (this.loading = false)
    );
  }

  onCreate(configure: boolean) {
    this.loading = true;
    this.configure = configure;
    this.facilitiesManager
      .createFacility(this.nameControl.value, this.descControl.value)
      .subscribe((facility) => {
        this.entityStorageService.setEntity({ id: facility.id, beanName: facility.beanName });
        sessionStorage.setItem('newFacilityId', String(facility.id));
        if (this.srcFacility !== null) {
          this.copyFacilitySettings(facility.id);
        } else {
          this.handleSuccess(facility.id);
        }
      });
  }

  handleSuccess(facilityId) {
    this.notificator.showSuccess(this.translate.instant('DIALOGS.CREATE_FACILITY.SUCCESS'));
    if (this.configure) {
      this.router.navigate(['facilities', facilityId.toString(), 'configuration']);
    }
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}