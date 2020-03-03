import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';


export interface InviteMemberDialogData {
  voId: number;
}

@Component({
  selector: 'app-invite-member-dialog',
  templateUrl: './invite-member-dialog.component.html',
  styleUrls: ['./invite-member-dialog.component.scss']
})
export class InviteMemberDialogComponent implements OnInit {

  emailForm = new FormControl('', [Validators.required, Validators.email]);
  language = 'en';
  name = '';

  constructor(public dialogRef: MatDialogRef<InviteMemberDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: InviteMemberDialogData,
              private registrarManager: RegistrarManagerService,
              private snackBar: MatSnackBar,
              private translate: TranslateService) { }

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.emailForm.invalid || this.name === '') {
      return;
    } else {
      this.registrarManager.sendInvitation(this.emailForm.value, 'en', this.data.voId).subscribe(() => {
        this.translate.get('DIALOGS.INVITE_MEMBER.SUCCESS').subscribe(successMessage => {
          this.snackBar.open(successMessage, null, {duration: 5000});
          this.dialogRef.close();
        });
      });
    }
  }

}
