import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';

import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  Attribute,
  AttributesManagerService,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService, NotificatorService } from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';
import {
  emailRegexString,
  EXTSOURCE_IDP,
  getElementFromSingleArray,
} from '@perun-web-apps/perun/utils';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { AlertComponent } from '@perun-web-apps/ui/alerts';

export interface ChangeEmailDialogData {
  userId: number;
  enableLinkedEmail: boolean;
  enableCustomEmail: boolean;
  customEmailRequiresVerification: boolean;
  currentEmail: string;
  verifiedEmailsAttribute?: string;
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
    AlertComponent,
    CustomTranslatePipe,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-change-email-dialog',
  templateUrl: './change-email-dialog.component.html',
  styleUrls: ['./change-email-dialog.component.scss'],
})
export class ChangeEmailDialogComponent implements OnInit {
  uesEmails: string[] = [];
  verifiedEmails: string[] = [];
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
      Validators.pattern(emailRegexString),
    ]);
    forkJoin({
      pendingMails: this.usersManagerService.getPendingPreferredEmailChanges(this.data.userId),
      verifiedEmails: this.getVerifiedEmails(),
      linkedEmails: this.getLinkedEmails(),
    }).subscribe(({ pendingMails, verifiedEmails, linkedEmails }) => {
      this.setPendingMails(pendingMails);
      this.verifiedEmails = verifiedEmails;
      this.uesEmails = linkedEmails.filter((email) => !verifiedEmails.includes(email));
      this.selectedEmail = getElementFromSingleArray(this.getSelectableEmails());
      this.loading = false;
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
    } else if (this.verifiedEmails.includes(this.selectedEmail)) {
      this.usersManagerService
        .changeEmailFromAttribute(this.data.userId, this.selectedEmail)
        .subscribe({
          next: () => {
            this.notificator.showSuccess(this.successMessage);
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

  private setPendingMails(mails: string[]): void {
    this.pendingMails = mails.filter((el, i, a) => i === a.indexOf(el));
    this.pendingEmailsMessage =
      this.pendingEmailsMessageStart + this.pendingMails.join(', ') + this.pendingEmailsMessageEnd;
  }

  private getVerifiedEmails(): Observable<string[]> {
    if (!this.data.verifiedEmailsAttribute) {
      return of<string[]>([]);
    }
    return this.attributesManagerService
      .getUserAttributeByName(
        this.data.userId,
        `urn:perun:user:attribute-def:def:${this.data.verifiedEmailsAttribute}`,
      )
      .pipe(
        map((attribute) =>
          ((attribute?.value as string[]) ?? []).filter(
            (email) => email !== this.data.currentEmail,
          ),
        ),
        catchError(() => of<string[]>([])),
      );
  }

  private getLinkedEmails(): Observable<string[]> {
    if (!this.data.enableLinkedEmail) {
      return of<string[]>([]);
    }
    return this.usersManagerService.getRichUserExtSources(this.data.userId).pipe(
      switchMap((userExtSources): Observable<Attribute[]> => {
        const uesWithLoa = userExtSources.filter(
          (ues) => ues.userExtSource.loa > 0 && ues.userExtSource.extSource.type === EXTSOURCE_IDP,
        );
        if (uesWithLoa.length === 0) {
          return of<Attribute[]>([]);
        }
        return forkJoin(
          uesWithLoa.map((ues) =>
            this.attributesManagerService.getUserExtSourceAttributeByName(
              ues.userExtSource.id,
              Urns.UES_DEF_MAIL,
            ),
          ),
        );
      }),
      map((mailAttrs) =>
        mailAttrs
          .map((mailAttr) => mailAttr?.value as string)
          .filter(
            (email, i, emails) =>
              email && email !== this.data.currentEmail && emails.indexOf(email) === i,
          ),
      ),
    );
  }

  private getSelectableEmails(): string[] {
    return this.verifiedEmails
      .concat(this.uesEmails)
      .concat(this.data.enableCustomEmail ? [this.CUSTOM_OPTION] : []);
  }
}
