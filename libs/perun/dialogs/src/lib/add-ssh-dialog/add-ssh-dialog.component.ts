import { TranslateModule } from '@ngx-translate/core';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';

export interface AddSshDialogData {
  attribute: Attribute;
  userId: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    CustomTranslatePipe,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-add-ssh-dialog',
  templateUrl: './add-ssh-dialog.component.html',
  styleUrls: ['./add-ssh-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddSshDialogComponent implements OnInit {
  static readonly allowedSshKeys = [
    'ssh-ed25519',
    'ssh-ed25519-cert-v01@openssh.com',
    'sk-ssh-ed25519@openssh.com',
    'sk-ssh-ed25519-cert-v01@openssh.com',
    'ssh-rsa',
    'ssh-dss',
    'ecdsa-sha2-nistp256',
    'ecdsa-sha2-nistp384',
    'ecdsa-sha2-nistp521',
    'sk-ecdsa-sha2-nistp256@openssh.com',
    'ssh-rsa-cert-v01@openssh.com',
    'ssh-dss-cert-v01@openssh.com',
    'ecdsa-sha2-nistp256-cert-v01@openssh.com',
    'ecdsa-sha2-nistp384-cert-v01@openssh.com',
    'ecdsa-sha2-nistp521-cert-v01@openssh.com',
    'sk-ecdsa-sha2-nistp256-cert-v01@openssh.com',
  ];
  static readonly sshKeyPattern = '^(' + AddSshDialogComponent.allowedSshKeys.join('|') + ').+$';
  sshControl: UntypedFormControl;

  constructor(
    private dialogRef: MatDialogRef<AddSshDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddSshDialogData,
    private attributesManagerService: AttributesManagerService,
  ) {}

  ngOnInit(): void {
    this.sshControl = new UntypedFormControl(null, [
      Validators.required,
      Validators.pattern(AddSshDialogComponent.sshKeyPattern),
    ]);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    const keys: string[] = (this.data.attribute?.value as string[]) ?? [];
    const ssh = this.sshControl.value as string;
    if (!keys.includes(ssh)) {
      keys.push(ssh);
    }
    this.data.attribute.value = keys;

    this.attributesManagerService
      .setUserAttribute({ user: this.data.userId, attribute: this.data.attribute })
      .subscribe(
        () => {
          this.dialogRef.close(true);
        },
        () => {
          keys.pop();
        },
      );
  }
}
