import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatListModule, MatListItem } from '@angular/material/list';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Facility,
  Group,
  Resource,
  Service,
  User,
  UsersManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { DeleteDialogTypePipe, UserFullNamePipe } from '@perun-web-apps/perun/pipes';
import { RemoveGroupTooltipPipe } from '@perun-web-apps/perun/pipes';

type entityToDelete = Facility | Group | Vo | Resource | User | Service;

export interface DeleteDialogResult {
  deleted: boolean;
  force: boolean;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    UiAlertsModule,
    LoadingDialogComponent,
    MatListModule,
    MatListItem,
    MatTableModule,
    TranslateModule,
    MatTooltip,
    LoaderDirective,
    DeleteDialogTypePipe,
    RemoveGroupTooltipPipe,
    UserFullNamePipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-delete-entity-dialog',
  templateUrl: './delete-entity-dialog.component.html',
  styleUrls: ['./delete-entity-dialog.component.scss'],
})
export class DeleteEntityDialogComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  entityNames: MatTableDataSource<entityToDelete> = new MatTableDataSource<entityToDelete>();
  @Input()
  entityType: string;
  @Input()
  relations: string[] = [];
  @Input()
  anotherMessage: string;
  @Input()
  disableForce = false;
  @Input()
  loading = false;
  @Input()
  anonymize = false;
  @Input()
  lastGroupsVo: number[] = [];
  @Input()
  lastGroupsFac: number[] = [];

  @Output()
  deleted: EventEmitter<DeleteDialogResult> = new EventEmitter<DeleteDialogResult>();

  force = false;

  deleteReg: RegExp;
  deleteControl: UntypedFormControl;
  warnMessage: string;
  lastOwnerAnyServiceAccount: boolean = false;
  serviceAccountsLeftUnattended: MatTableDataSource<string> = new MatTableDataSource<string>();

  constructor(private userManager: UsersManagerService) {}

  ngOnInit(): void {
    this.deleteReg = this.anonymize ? /^ANONYMIZE$/ : /^DELETE$/;
    this.deleteControl = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(this.deleteReg),
    ]);
    if (this.anonymize) {
      this.loading = true;
      const removedOwner = this.entityNames.data[0];
      if (!(removedOwner as User).serviceUser) {
        this.userManager.getSpecificUsersByUser(removedOwner.id).subscribe({
          next: (resultSpecificUsers) => {
            if (resultSpecificUsers.length === 0) this.loading = false;
            for (let i = 0; i < resultSpecificUsers.length; i++) {
              const specificUser = resultSpecificUsers[i];
              this.userManager.getUnanonymizedUsersBySpecificUser(specificUser.id).subscribe({
                next: (associatedUsers) => {
                  if (associatedUsers.length === 1) {
                    if (associatedUsers[0].id === removedOwner.id) {
                      this.lastOwnerAnyServiceAccount ||= true;

                      const oldServiceAccounts = this.serviceAccountsLeftUnattended.data;
                      const serviceAccountToAdd =
                        specificUser.firstName +
                        (specificUser.middleName ? ' ' + specificUser.middleName : '') +
                        ' ' +
                        specificUser.lastName;
                      this.serviceAccountsLeftUnattended.data = [
                        ...oldServiceAccounts,
                        serviceAccountToAdd,
                      ];
                    }
                    if (i === resultSpecificUsers.length - 1) {
                      this.loading = false;
                    }
                  }
                },
                error: () => {
                  if (i === resultSpecificUsers.length - 1) {
                    this.loading = false;
                  }
                },
              });
            }
          },
          error: () => {
            this.loading = false;
          },
        });
      } else {
        this.loading = false;
      }
    }
  }

  onCancel(): void {
    const result = { deleted: false, force: false };
    this.deleted.emit(result);
  }

  onDelete(): void {
    const result = { deleted: true, force: this.force };
    this.deleted.emit(result);
  }
}
