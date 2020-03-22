import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { NotificatorService } from '../../../../../../admin-gui/src/app/core/services/common/notificator.service';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { TranslateService } from '@ngx-translate/core';

export interface ChangeEmailDialogData {
  userId: number;
  attribute: Attribute;
}

@Component({
  selector: 'perun-web-apps-change-email-dialog',
  templateUrl: './change-email-dialog.component.html',
  styleUrls: ['./change-email-dialog.component.scss']
})
export class ChangeEmailDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ChangeEmailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: ChangeEmailDialogData,
              private notificator: NotificatorService,
              private translate: TranslateService,
              private attributesManagerService: AttributesManagerService
  ) {
  }

  emailControl: FormControl;

  ngOnInit() {
    this.emailControl = new FormControl(null, [Validators.required,
      Validators.pattern(/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)]);

  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    this.data.attribute.value = this.emailControl.value;
    this.attributesManagerService.setUserAttribute({ user: this.data.userId, attribute: this.data.attribute }).subscribe(() => {
      // this.notificator.showSuccess("done");
      this.dialogRef.close(true);
    });

  }
}
