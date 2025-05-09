import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttributesManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { UntypedFormControl, Validators } from '@angular/forms';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { EXTSOURCE_IDP, getElementFromSingleArray } from '@perun-web-apps/perun/utils';

export interface ChangeNameDialogData {
  userId: number;
  enableLinkedName: boolean;
  enableCustomName: boolean;
  customNameRequiresApprove: boolean;
  currentName: string;
}

@Component({
  selector: 'perun-web-apps-change-name-dialog',
  templateUrl: './change-name-dialog.component.html',
  styleUrls: ['./change-name-dialog.component.scss'],
})
export class ChangeNameDialogComponent implements OnInit {
  CUSTOM_OPTION = 'CUSTOM_OPTION';
  uesNames: string[] = [];
  selectedName = this.CUSTOM_OPTION;
  titleBefore: UntypedFormControl;
  titleAfter: UntypedFormControl;
  firstName: UntypedFormControl;
  middleName: UntypedFormControl;
  lastName: UntypedFormControl;

  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: ChangeNameDialogData,
    private dialogRef: MatDialogRef<ChangeNameDialogComponent>,
    private usersManagerService: UsersManagerService,
    private attributesManagerService: AttributesManagerService,
    private notificator: NotificatorService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.usersManagerService.getUserById(this.data.userId).subscribe({
      next: (user) => {
        this.titleBefore = new UntypedFormControl(user.titleBefore ? user.titleBefore : '', [
          Validators.pattern('.*[\\S]+.*'),
          Validators.maxLength(129),
        ]);

        this.titleAfter = new UntypedFormControl(user.titleAfter ? user.titleAfter : '', [
          Validators.pattern('.*[\\S]+.*'),
          Validators.maxLength(129),
        ]);

        this.firstName = new UntypedFormControl(user.firstName ? user.firstName : '', [
          Validators.required,
          Validators.pattern('.*[\\S]+.*'),
          Validators.maxLength(129),
        ]);

        this.middleName = new UntypedFormControl(user.middleName ? user.middleName : '', [
          Validators.pattern('.*[\\S]+.*'),
          Validators.maxLength(129),
        ]);

        this.lastName = new UntypedFormControl(user.lastName ? user.lastName : '', [
          Validators.required,
          Validators.pattern('.*[\\S]+.*'),
          Validators.maxLength(129),
        ]);

        if (this.data.enableLinkedName) {
          this.usersManagerService
            .getRichUserExtSources(this.data.userId)
            .subscribe((userExtSources) => {
              const uesWithLoa = userExtSources.filter(
                (ues) =>
                  ues.userExtSource.loa > 0 && ues.userExtSource.extSource.type === EXTSOURCE_IDP,
              );
              let completed = 0;
              uesWithLoa.forEach((ues) => {
                this.attributesManagerService
                  .getUserExtSourceAttributeByName(ues.userExtSource.id, Urns.UES_DEF_COMMON_NAME)
                  .subscribe((displayNameAttr) => {
                    if (
                      displayNameAttr?.value &&
                      displayNameAttr.value !== this.data.currentName &&
                      !this.uesNames.includes(displayNameAttr.value as string)
                    ) {
                      this.uesNames.push(displayNameAttr.value as string);
                    }
                    completed++;
                    this.selectedName = getElementFromSingleArray(
                      this.uesNames.concat(this.data.enableCustomName ? [this.CUSTOM_OPTION] : []),
                    );
                    this.loading = completed !== uesWithLoa.length;
                  });
              });
            });
        } else {
          this.selectedName = getElementFromSingleArray(
            this.data.enableCustomName ? [this.CUSTOM_OPTION] : [],
          );
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.loading = true;
    if (this.selectedName === this.CUSTOM_OPTION) {
      this.usersManagerService
        .changeNameCustom(
          this.data.userId,
          this.titleBefore.value as string,
          this.firstName.value as string,
          this.middleName.value as string,
          this.lastName.value as string,
          this.titleAfter.value as string,
        )
        .subscribe({
          next: () => {
            this.notificator.showSuccess(
              this.data.customNameRequiresApprove
                ? 'DIALOGS.CHANGE_NAME.WAIT'
                : 'DIALOGS.CHANGE_NAME.SUCCESS',
            );
            this.loading = false;
            this.dialogRef.close(true);
          },
          error: () => {
            this.loading = false;
          },
        });
    } else {
      this.usersManagerService.changeName(this.data.userId, this.selectedName).subscribe({
        next: () => {
          this.notificator.showSuccess('DIALOGS.CHANGE_NAME.SUCCESS');
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
