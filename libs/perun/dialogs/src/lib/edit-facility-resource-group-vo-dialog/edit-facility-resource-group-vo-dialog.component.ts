import { Component, Inject, OnInit } from '@angular/core';
import {
  FacilitiesManagerService,
  Facility,
  Group,
  GroupsManagerService,
  Resource,
  ResourcesManagerService,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { spaceNameValidator } from '@perun-web-apps/perun/utils';

export enum EditFacilityResourceGroupVoDialogOptions {
  FACILITY,
  RESOURCE,
  VO,
  GROUP,
}

export interface EditFacilityResourceGroupVoDialogData {
  theme: string;
  facility: Facility;
  resource: Resource;
  vo: Vo;
  group: Group;
  dialogType: EditFacilityResourceGroupVoDialogOptions;
}

@Component({
  selector: 'perun-web-apps-edit-facility-resource-group-vo-dialog',
  templateUrl: './edit-facility-resource-group-vo-dialog.component.html',
  styleUrls: ['./edit-facility-resource-group-vo-dialog.component.scss'],
})
export class EditFacilityResourceGroupVoDialogComponent implements OnInit {
  invalidNameMessage: string =
    this.data.dialogType === EditFacilityResourceGroupVoDialogOptions.GROUP
      ? this.store.getProperty('group_name_error_message')
      : '';

  theme: string;
  nameCtrl: FormControl<string>;
  descriptionCtrl: FormControl<string>;
  shortName: string;
  dialogType: EditFacilityResourceGroupVoDialogOptions;
  loading = false;
  secondaryRegex: string =
    this.data.dialogType === EditFacilityResourceGroupVoDialogOptions.GROUP
      ? this.store.getProperty('group_name_secondary_regex')
      : '';

  constructor(
    private dialogRef: MatDialogRef<EditFacilityResourceGroupVoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EditFacilityResourceGroupVoDialogData,
    private notificator: NotificatorService,
    private translateService: TranslateService,
    private facilitiesManager: FacilitiesManagerService,
    private resourcesManager: ResourcesManagerService,
    private groupsManager: GroupsManagerService,
    private vosManager: VosManagerService,
    private store: StoreService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.dialogType = this.data.dialogType;
    switch (this.dialogType) {
      case EditFacilityResourceGroupVoDialogOptions.FACILITY:
        this.nameCtrl = new FormControl(this.data.facility.name, [
          Validators.required,
          Validators.pattern('.*[\\S]+.*'),
          Validators.maxLength(129),
        ]);
        this.descriptionCtrl = new FormControl(this.data.facility.description);
        break;
      case EditFacilityResourceGroupVoDialogOptions.RESOURCE:
        this.nameCtrl = new FormControl(this.data.resource.name, [
          Validators.required,
          Validators.pattern('.*[\\S]+.*'),
        ]);
        this.descriptionCtrl = new FormControl(this.data.resource.description);
        break;
      case EditFacilityResourceGroupVoDialogOptions.GROUP: {
        const nameParts = this.data.group.name.split(':');
        this.nameCtrl = new FormControl(nameParts[nameParts.length - 1], [
          Validators.required,
          Validators.pattern('.*[\\S]+.*'),
          Validators.pattern(this.secondaryRegex),
          Validators.maxLength(129),
        ]);
        this.descriptionCtrl = new FormControl(this.data.group.description);
        break;
      }
      case EditFacilityResourceGroupVoDialogOptions.VO:
        this.shortName = this.data.vo.shortName;
        this.nameCtrl = new FormControl(this.data.vo.name, [
          Validators.required,
          Validators.pattern('.*[\\S]+.*'),
          Validators.maxLength(129),
        ]);
        this.descriptionCtrl = new FormControl('');
        break;
    }
    this.nameCtrl.addValidators(spaceNameValidator());
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.loading = true;
    switch (this.dialogType) {
      case EditFacilityResourceGroupVoDialogOptions.FACILITY:
        this.editFacility();
        break;
      case EditFacilityResourceGroupVoDialogOptions.RESOURCE:
        this.editResource();
        break;
      case EditFacilityResourceGroupVoDialogOptions.GROUP:
        this.editGroup();
        break;
      case EditFacilityResourceGroupVoDialogOptions.VO:
        this.editVo();
        break;
    }
  }

  editResource(): void {
    this.data.resource.name = this.nameCtrl.value;
    this.data.resource.description = this.descriptionCtrl.value;
    this.resourcesManager.updateResource({ resource: this.data.resource }).subscribe({
      next: () => {
        this.translateService
          .get('DIALOGS.EDIT_FACILITY_RESOURCE_GROUP_VO.RESOURCE_SUCCESS')
          .subscribe((message: string) => {
            this.notificator.showSuccess(message);
            this.dialogRef.close(true);
          });
      },
      error: () => (this.loading = false),
    });
  }

  editFacility(): void {
    this.data.facility.name = this.nameCtrl.value;
    this.data.facility.description = this.descriptionCtrl.value;
    this.facilitiesManager.updateFacility({ facility: this.data.facility }).subscribe({
      next: () => {
        this.translateService
          .get('DIALOGS.EDIT_FACILITY_RESOURCE_GROUP_VO.FACILITY_SUCCESS')
          .subscribe((message: string) => {
            this.notificator.showSuccess(message);
            this.dialogRef.close(true);
          });
      },
      error: () => (this.loading = false),
    });
  }

  editGroup(): void {
    this.groupsManager.getGroupById(this.data.group.id).subscribe({
      next: (grp) => {
        const group = grp;
        group.name = this.nameCtrl.value;
        group.description = this.descriptionCtrl.value;
        this.groupsManager.updateGroup({ group: group }).subscribe({
          next: () => {
            this.translateService
              .get('DIALOGS.EDIT_FACILITY_RESOURCE_GROUP_VO.GROUP_SUCCESS')
              .subscribe((message: string) => {
                this.notificator.showSuccess(message);
                this.dialogRef.close(true);
              });
          },
          error: () => (this.loading = false),
        });
      },
      error: () => (this.loading = false),
    });
  }

  editVo(): void {
    this.data.vo.name = this.nameCtrl.value;
    this.vosManager.updateVo({ vo: this.data.vo }).subscribe({
      next: () => {
        this.translateService
          .get('DIALOGS.EDIT_FACILITY_RESOURCE_GROUP_VO.VO_SUCCESS')
          .subscribe((message: string) => {
            this.notificator.showSuccess(message);
            this.dialogRef.close(true);
          });
      },
      error: () => (this.loading = false),
    });
  }
}
