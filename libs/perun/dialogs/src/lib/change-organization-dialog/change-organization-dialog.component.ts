import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Urns } from '@perun-web-apps/perun/urns';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import { UntypedFormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { EXTSOURCE_IDP, getElementFromSingleArray } from '@perun-web-apps/perun/utils';

export interface ChangeOrganizationDialogData {
  userId: number;
  enableLinkedOrganization: boolean;
  enableCustomOrganization: boolean;
  customOrganizationRequiresApprove: boolean;
  currentOrganization: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    UiAlertsModule,
    CustomTranslatePipe,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-change-organization-dialog',
  templateUrl: './change-organization-dialog.component.html',
  styleUrls: ['./change-organization-dialog.component.scss'],
})
export class ChangeOrganizationDialogComponent implements OnInit {
  uesOrganizations: string[] = [];
  selectedOrganization: string;

  CUSTOM_OPTION = 'CUSTOM_OPTION';
  customOrganization: UntypedFormControl;

  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: ChangeOrganizationDialogData,
    private dialogRef: MatDialogRef<ChangeOrganizationDialogComponent>,
    private usersManagerService: UsersManagerService,
    private notificator: NotificatorService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.customOrganization = new UntypedFormControl('', [Validators.required]);

    if (this.data.enableLinkedOrganization) {
      this.usersManagerService
        .getRichUserExtSources(this.data.userId)
        .subscribe((userExtSources) => {
          const uesWithLoa = userExtSources.filter(
            (ues) =>
              ues.userExtSource.loa > 0 && ues.userExtSource.extSource.type === EXTSOURCE_IDP,
          );
          uesWithLoa.forEach((ues) => {
            const organizationAttr = ues.attributes.find(
              (attr) => attr.namespace + ':' + attr.friendlyName === Urns.UES_DEF_ORGANIZATION,
            );
            if (
              organizationAttr?.value &&
              organizationAttr?.value !== this.data.currentOrganization
            ) {
              this.uesOrganizations.push(organizationAttr.value as string);
            }
          });
          this.uesOrganizations = Array.from(new Set(this.uesOrganizations));
          this.selectedOrganization = getElementFromSingleArray(
            this.uesOrganizations.concat(
              this.data.enableCustomOrganization ? [this.CUSTOM_OPTION] : [],
            ),
          );
          this.loading = false;
        });
    } else {
      this.selectedOrganization = getElementFromSingleArray(
        this.data.enableCustomOrganization ? [this.CUSTOM_OPTION] : [],
      );
      this.loading = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.loading = true;
    if (this.selectedOrganization === this.CUSTOM_OPTION) {
      this.usersManagerService
        .changeOrganizationCustom(this.data.userId, this.customOrganization.value as string)
        .subscribe({
          next: () => {
            this.notificator.showSuccess(
              this.data.customOrganizationRequiresApprove
                ? 'DIALOGS.CHANGE_ORGANIZATION.WAIT'
                : 'DIALOGS.CHANGE_ORGANIZATION.SUCCESS',
            );
            this.loading = false;
            this.dialogRef.close(true);
          },
          error: () => {
            this.loading = false;
          },
        });
    } else {
      this.usersManagerService
        .changeOrganization(this.data.userId, this.selectedOrganization)
        .subscribe({
          next: () => {
            this.notificator.showSuccess('DIALOGS.CHANGE_ORGANIZATION.SUCCESS');
            this.loading = false;
            this.dialogRef.close(true);
          },
          error: () => {
            this.loading = false;
          },
        });
    }
  }
}
