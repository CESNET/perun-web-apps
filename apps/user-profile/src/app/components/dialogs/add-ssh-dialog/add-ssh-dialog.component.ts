import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { FormControl, Validators } from '@angular/forms';

export interface AddSshDialogData {
  attribute: Attribute;
  userId: number;
}

@Component({
  selector: 'perun-web-apps-add-ssh-dialog',
  templateUrl: './add-ssh-dialog.component.html',
  styleUrls: ['./add-ssh-dialog.component.scss']
})
export class AddSshDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddSshDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: AddSshDialogData,
              private attributesManagerService: AttributesManagerService
              ) { }

  sshControl: FormControl;

  ngOnInit() {
    this.sshControl = new FormControl(null, [Validators.required, Validators.pattern('^(ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521).+$')]);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    // @ts-ignore
    const keys: string[] = this.data.attribute.value ? this.data.attribute.value : [];
    keys.push(this.sshControl.value);
    this.data.attribute.value = keys;

    this.attributesManagerService.setUserAttribute({ user: this.data.userId, attribute: this.data.attribute }).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
