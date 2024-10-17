import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  Facility,
  Group,
  Resource,
  Service,
  User,
  UsersManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';

type entityToDelete = Facility | Group | Vo | Resource | User | Service;

export interface DeleteDialogResult {
  deleted: boolean;
  force: boolean;
}

@Component({
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
      this.userManager.getSpecificUsersByUser(removedOwner.id).subscribe((resultSpecificUsers) => {
        resultSpecificUsers.forEach((specificUser: User) => {
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
                this.loading = false;
              }
            },
            error: () => {
              this.loading = false;
            },
          });
        });
      });
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
