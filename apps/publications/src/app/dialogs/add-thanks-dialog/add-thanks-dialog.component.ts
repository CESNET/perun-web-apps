import { DebounceFilterComponent } from '@perun-web-apps/perun/components';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import {
  CabinetManagerService,
  Owner,
  OwnersManagerService,
  PublicationForGUI,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { OwnersListComponent } from '@perun-web-apps/perun/components';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    DebounceFilterComponent,
    TranslateModule,
    LoaderDirective,
    OwnersListComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-add-thanks-dialog',
  templateUrl: './add-thanks-dialog.component.html',
  styleUrls: ['./add-thanks-dialog.component.scss'],
})
export class AddThanksDialogComponent implements OnInit {
  loading: boolean;
  owners: Owner[] = [];
  selected = new SelectionModel<Owner>(true, [], true, (owner1, owner2) => owner1.id === owner2.id);
  cachedSubject = new BehaviorSubject(true);
  filterValue: string;

  constructor(
    private dialogRef: MatDialogRef<AddThanksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PublicationForGUI,
    private ownersManagerService: OwnersManagerService,
    private storeService: StoreService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private cabinetManagerService: CabinetManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const allowedOwners = this.storeService.getProperty('allowed_owners_for_thanks');
    this.ownersManagerService.getAllOwners().subscribe((owners) => {
      if (allowedOwners.length !== 0) {
        this.owners = owners.filter((item) => allowedOwners.includes(String(item.id)));
      } else {
        this.owners = owners;
      }
      this.owners = this.owners.filter(
        (item) => !this.data.thanks.map((thanks) => thanks.ownerId).includes(item.id),
      );

      this.loading = false;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.loading = true;
    if (this.selected.selected.length === 0) {
      this.translate.get('DIALOGS.ADD_THANKS.SUCCESS').subscribe((success: string) => {
        this.notificator.showSuccess(success);
        this.dialogRef.close(true);
      });
    } else {
      this.cabinetManagerService
        .createThanks({
          thanks: {
            publicationId: this.data.id,
            ownerId: this.selected.selected.pop().id,
            createdBy: this.storeService.getPerunPrincipal().actor,
            createdByUid: this.storeService.getPerunPrincipal().userId,
            createdDate: Date.now().toString(),
            id: 0,
            beanName: 'Thanks',
          },
        })
        .subscribe({
          next: () => {
            this.onSubmit();
          },
          error: () => {
            this.loading = false;
          },
        });
    }
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.selected.clear();
    this.cachedSubject.next(true);
  }
}
