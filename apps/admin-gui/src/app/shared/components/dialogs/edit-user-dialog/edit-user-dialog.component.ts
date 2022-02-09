import { Component, Inject, OnInit } from '@angular/core';
import { User, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';

export interface EditUserDialogData {
  theme: string;
  user: User;
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
})
export class EditUserDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EditUserDialogData,
    private userService: UsersManagerService,
    private notificator: NotificatorService,
    private translateService: TranslateService
  ) {}

  theme: string;
  loading = false;

  titleBefore: FormControl;
  titleAfter: FormControl;

  firstName: FormControl;
  middleName: FormControl;
  lastName: FormControl;

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.titleBefore = new FormControl(this.data.user.titleBefore, [
      Validators.pattern('.*[\\S]+.*'),
      Validators.maxLength(129),
    ]);

    this.titleAfter = new FormControl(this.data.user.titleAfter, [
      Validators.pattern('.*[\\S]+.*'),
      Validators.maxLength(129),
    ]);

    this.firstName = new FormControl(this.data.user.firstName, [
      Validators.required,
      Validators.pattern('.*[\\S]+.*'),
      Validators.maxLength(129),
    ]);

    this.middleName = new FormControl(this.data.user.middleName, [
      Validators.pattern('.*[\\S]+.*'),
      Validators.maxLength(129),
    ]);

    this.lastName = new FormControl(this.data.user.lastName, [
      Validators.required,
      Validators.pattern('.*[\\S]+.*'),
      Validators.maxLength(129),
    ]);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSave() {
    this.loading = true;
    this.data.user.titleBefore = this.titleBefore.value;
    this.data.user.titleAfter = this.titleAfter.value;
    this.data.user.firstName = this.firstName.value;
    this.data.user.middleName = this.middleName.value;
    this.data.user.lastName = this.lastName.value;

    this.userService.updateUser({ user: this.data.user }).subscribe(
      () => {
        this.translateService.get('DIALOGS.EDIT_USER.SUCCESS').subscribe((message) => {
          this.notificator.showSuccess(message);
          this.dialogRef.close(true);
        });
      },
      () => (this.loading = false)
    );
  }
}
