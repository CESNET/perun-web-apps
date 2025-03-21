import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacilitiesManagerService, Facility } from '@perun-web-apps/perun/openapi';
import { EntityStorageService, NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { spaceNameValidator } from '@perun-web-apps/perun/utils';
import { EntityPathParam } from '@perun-web-apps/perun/models';

export interface CreateFacilityDialogData {
  theme: string;
}

@Component({
  selector: 'app-create-facility-dialog',
  templateUrl: './create-facility-dialog.component.html',
  styleUrls: ['./create-facility-dialog.component.scss'],
})
export class CreateFacilityDialogComponent implements OnInit {
  theme: string;
  nameControl = new FormControl('', [Validators.required, spaceNameValidator()]);
  descControl = new FormControl('');
  facilities: Facility[];
  srcFacility: Facility = null;
  loading = false;
  private configure = false;

  constructor(
    private dialogRef: MatDialogRef<CreateFacilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CreateFacilityDialogData,
    public facilitiesManager: FacilitiesManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private router: Router,
    private entityStorageService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;

    this.loading = true;
    this.facilitiesManager.getAllFacilities().subscribe({
      next: (facilities) => {
        this.facilities = facilities;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onCreate(configure: boolean): void {
    this.loading = true;
    this.configure = configure;
    this.facilitiesManager
      .createFacility(this.nameControl.value, this.descControl.value)
      .subscribe({
        next: (facility) => {
          this.entityStorageService.setEntityAndPathParam(
            { id: facility.id, beanName: facility.beanName },
            EntityPathParam.Facility,
          );
          sessionStorage.setItem('newFacilityId', String(facility.id));
          if (this.srcFacility !== null) {
            this.copyFacilitySettings(facility.id);
          } else {
            this.handleSuccess(facility.id);
          }
        },
        error: () => (this.loading = false),
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private copyFacilitySettings(destFacility: number): void {
    this.facilitiesManager.copyAttributes(this.srcFacility.id, destFacility).subscribe({
      next: () => {
        this.facilitiesManager.copyManagers(this.srcFacility.id, destFacility).subscribe({
          next: () => {
            this.handleSuccess(destFacility);
          },
          error: () => (this.loading = false),
        });
      },
      error: () => (this.loading = false),
    });
  }

  private handleSuccess(facilityId: number): void {
    this.notificator.showSuccess(
      this.translate.instant('DIALOGS.CREATE_FACILITY.SUCCESS') as string,
    );
    if (this.configure) {
      void this.router.navigate(['facilities', facilityId.toString(), 'configuration'], {
        queryParamsHandling: 'preserve',
      });
    }
    this.dialogRef.close(true);
  }
}
