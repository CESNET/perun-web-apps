import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttributesManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, NotificatorService } from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';

export interface ChangeEmailDialogData {
  userId: number;
  enableLinkedEmail: boolean;
  enableCustomEmail: boolean;
  customEmailRequiresVerification: boolean;
  currentEmail: string;
}

@Component({
  selector: 'perun-web-apps-change-email-dialog',
  templateUrl: './change-email-dialog.component.html',
  styleUrls: ['./change-email-dialog.component.scss'],
})
export class ChangeEmailDialogComponent implements OnInit {
  uesEmails: string[] = [];
  selectedEmail: string;
  successMessage: string;
  pendingMails: string[] = [];
  emailControl: UntypedFormControl;
  pendingEmailsMessageStart: string;
  pendingEmailsMessageEnd: string;
  pendingEmailsMessage: string;
  waitMessage: string;

  loading = false;

  CUSTOM_OPTION = 'CUSTOM_OPTION';

  constructor(
    private dialogRef: MatDialogRef<ChangeEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: ChangeEmailDialogData,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private usersManagerService: UsersManagerService,
    private authService: AuthService,
    private attributesManagerService: AttributesManagerService,
  ) {
    translate
      .get('DIALOGS.CHANGE_EMAIL.SUCCESS')
      .subscribe((res: string) => (this.successMessage = res));
    translate.get('DIALOGS.CHANGE_EMAIL.WAIT').subscribe((res: string) => (this.waitMessage = res));
    translate
      .get('DIALOGS.CHANGE_EMAIL.PENDING_MAILS_BEGIN')
      .subscribe((res: string) => (this.pendingEmailsMessageStart = res));
    translate
      .get('DIALOGS.CHANGE_EMAIL.PENDING_MAILS_END')
      .subscribe((res: string) => (this.pendingEmailsMessageEnd = res));
  }

  ngOnInit(): void {
    this.loading = true;
    this.emailControl = new UntypedFormControl(null, [
      Validators.required,
      Validators.pattern(
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
      ),
    ]);
    this.usersManagerService
      .getPendingPreferredEmailChanges(this.data.userId)
      .subscribe((mails) => {
        this.pendingMails = mails.filter((el, i, a) => i === a.indexOf(el));
        let result = '';
        this.pendingMails.forEach(
          (mail) => (result += `${mail === this.pendingMails[0] ? '' : ', '}${mail}`),
        );
        this.pendingEmailsMessage =
          this.pendingEmailsMessageStart + result + this.pendingEmailsMessageEnd;

        if (this.data.enableLinkedEmail) {
          this.usersManagerService
            .getRichUserExtSources(this.data.userId)
            .subscribe((userExtSources) => {
              const uesWithLoa = userExtSources.filter((ues) => ues.userExtSource.loa > 0);
              let completed = 0;
              uesWithLoa.forEach((ues) => {
                this.attributesManagerService
                  .getUserExtSourceAttributeByName(ues.userExtSource.id, Urns.UES_DEF_MAIL)
                  .subscribe((mailAttr) => {
                    if (
                      mailAttr?.value &&
                      mailAttr.value !== this.data.currentEmail &&
                      !this.uesEmails.includes(mailAttr.value as string)
                    ) {
                      this.uesEmails.push(mailAttr.value as string);
                    }
                    completed++;
                    this.loading = completed !== uesWithLoa.length;
                  });
              });
            });
        } else {
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.loading = true;

    const currentUrl = window.location.href;
    const splittedUrl = currentUrl.split('/');
    const domain = splittedUrl[0] + '//' + splittedUrl[2]; // protocol with domain

    if (this.selectedEmail === this.CUSTOM_OPTION) {
      this.usersManagerService
        .changeEmailCustom(
          this.data.userId,
          this.emailControl.value as string,
          this.translate.currentLang,
          '',
          domain,
          this.authService.getIdpFilter(),
        )
        .subscribe({
          next: () => {
            this.notificator.showSuccess(
              this.data.customEmailRequiresVerification ? this.waitMessage : this.successMessage,
            );
            this.loading = false;
            this.dialogRef.close(true);
          },
          error: () => {
            this.loading = false;
          },
        });
    } else {
      this.usersManagerService.changeEmail(this.data.userId, this.selectedEmail).subscribe({
        next: () => {
          this.notificator.showSuccess(this.successMessage);
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
