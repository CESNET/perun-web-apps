import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ExtSource,
  FacilitiesManagerService,
  Owner,
  OwnersManagerService,
} from '@perun-web-apps/perun/openapi';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { TABLE_ADD_EXTSOURCE_DIALOG } from '@perun-web-apps/config/table-config';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';

interface AddFacilityOwnerDialogData {
  theme: string;
  facilityId: number;
  forbiddenOwners: number[];
}

@Component({
  selector: 'app-add-facility-owner-dialog',
  templateUrl: './add-facility-owner-dialog.component.html',
  styleUrls: ['./add-facility-owner-dialog.component.scss'],
})
export class AddFacilityOwnerDialogComponent implements OnInit {
  theme: string;
  extSources: ExtSource[] = [];
  selection = new SelectionModel<Owner>(
    true,
    [],
    true,
    (owner1, owner2) => owner1.id === owner2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  loading: boolean;
  filterValue = '';
  tableId = TABLE_ADD_EXTSOURCE_DIALOG;
  owners: Owner[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddFacilityOwnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddFacilityOwnerDialogData,
    private notificator: NotificatorService,
    private translate: PerunTranslateService,
    private ownersManagerService: OwnersManagerService,
    private facilitiesManagerService: FacilitiesManagerService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.loading = true;
    this.ownersManagerService.getAllOwners().subscribe({
      next: (owners) => {
        this.owners = owners.filter((owner) => !this.data.forbiddenOwners.includes(owner.id));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.selection.clear();
    this.cachedSubject.next(true);
  }

  onAdd(): void {
    this.loading = true;
    const ownerIds = this.selection.selected.map((owner) => owner.id);
    this.facilitiesManagerService.addFacilityOwners(this.data.facilityId, ownerIds).subscribe({
      next: () => {
        this.loading = false;
        this.notificator.showSuccess(this.translate.instant('DIALOGS.ADD_OWNERS.SUCCESS'));
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false),
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
