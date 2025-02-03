import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { openClose, tagsOpenClose } from '@perun-web-apps/perun/animations';
import {
  ApplicationMail,
  GroupsManagerService,
  MailType,
  RegistrarManagerService,
} from '@perun-web-apps/perun/openapi';
import {
  GuiAuthResolver,
  PerunTranslateService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatTabChangeEvent } from '@angular/material/tabs';

export interface ApplicationFormAddEditMailDialogData {
  theme: string;
  voId: number;
  groupId: number;
  createMailNotification: boolean;
  applicationMail: ApplicationMail;
  applicationMails: ApplicationMail[];
}

@Component({
  selector: 'app-add-edit-notification-dialog',
  templateUrl: './add-edit-notification-dialog.component.html',
  styleUrls: ['./add-edit-notification-dialog.component.scss'],
  animations: [tagsOpenClose, openClose],
})
export class AddEditNotificationDialogComponent implements OnInit {
  applicationMail: ApplicationMail;
  mailType = new BehaviorSubject(this.data.applicationMail.mailType);
  showTags = false;
  invalidNotification = false;
  loading = false;
  theme: string;
  editAuth: boolean;
  languages = ['en'];
  formats = ['plain', 'html'];
  htmlAuth: boolean;
  inputFormGroup: FormGroup<Record<string, FormControl<string>>> = null;
  subjectId = 'perun-subject-input-id';
  textareaId = 'perun-text-textarea-id';
  noneFilled: boolean = true;
  previousMailType: MailType;

  constructor(
    private dialogRef: MatDialogRef<AddEditNotificationDialogComponent>,
    private registrarService: RegistrarManagerService,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationFormAddEditMailDialogData,
    private authResolver: GuiAuthResolver,
    private groupsService: GroupsManagerService,
    private store: StoreService,
    private translate: PerunTranslateService,
    public cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.languages = this.store.getProperty('supported_languages');
    // at this moment we want to enable the html notification settings just for Perun Admin
    this.htmlAuth = this.authResolver.isPerunAdmin();
    this.applicationMail = this.data.applicationMail;
    this.theme = this.data.theme;

    if (this.data.groupId) {
      this.groupsService.getGroupById(this.data.groupId).subscribe((group) => {
        this.editAuth = this.authResolver.isAuthorized(
          'group-addMail_ApplicationForm_ApplicationMail_policy',
          [group],
        );
      });
    } else if (this.data.voId) {
      const vo = {
        id: this.data.voId,
        beanName: 'Vo',
      };

      this.editAuth = this.authResolver.isAuthorized(
        'vo-addMail_ApplicationForm_ApplicationMail_policy',
        [vo],
      );
    }

    const formGroupFields: { [key: string]: FormControl<string> } = {};
    for (const lang of this.languages) {
      // Plain
      formGroupFields[`${lang}-plain-subject`] = new FormControl(
        this.applicationMail.message[lang].subject,
        [],
      );
      formGroupFields[`${lang}-plain-text`] = new FormControl(
        this.applicationMail.message[lang].text,
        [],
        [this.requestedTagsValidator.bind(this)],
      );
      // Html - other async validators are added in a separate component
      formGroupFields[`${lang}-html-subject`] = new FormControl(
        this.applicationMail.htmlMessage[lang].subject,
        [],
      );
      formGroupFields[`${lang}-html-text`] = new FormControl(
        this.applicationMail.htmlMessage[lang].text,
        [],
        [this.requestedTagsValidator.bind(this)],
      );
      formGroupFields[`${lang}-html-subject`].markAsTouched();
      formGroupFields[`${lang}-html-text`].markAsTouched();
    }
    this.inputFormGroup = new FormGroup(formGroupFields);
    this.checkEmptyContent();
    this.inputFormGroup.valueChanges.subscribe(() => {
      this.checkEmptyContent();
    });
  }

  requestedTagsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(500).pipe(
      switchMap(() => {
        const value = String(control.value);
        if (
          this.applicationMail.mailType === MailType.USER_PRE_APPROVED_INVITE &&
          value?.length > 0 &&
          (!value.includes('{preapprovedInvitationLink}') ||
            !String(control.value).includes('{expirationDate}'))
        ) {
          return of({ missingTags: 'DIALOGS.NOTIFICATIONS_ADD_EDIT_MAIL.MISSING_TAGS_ERROR' });
        }
        return of(null);
      }),
    );
  }

  missingTagsErrorExists(): boolean {
    return Object.keys(this.inputFormGroup.controls).some((key) =>
      this.inputFormGroup.get(key)?.hasError('missingTags'),
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }

  create(): void {
    this.notificationExist();
    if (this.invalidNotification) {
      return;
    }
    this.loading = true;
    this.prepareNotification();
    if (this.data.groupId) {
      this.registrarService
        .addApplicationMailForGroup({
          group: this.data.groupId,
          mail: this.applicationMail,
        })
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: () => (this.loading = false),
        });
    } else {
      this.registrarService
        .addApplicationMailForVo({
          vo: this.data.voId,
          mail: this.applicationMail,
        })
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: () => (this.loading = false),
        });
    }
  }

  save(): void {
    this.loading = true;
    this.prepareNotification();
    this.registrarService.updateApplicationMail({ mail: this.applicationMail }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false),
    });
  }

  notificationExist(): void {
    for (const mail of this.data.applicationMails) {
      if (
        mail.mailType === this.applicationMail.mailType &&
        mail.appType === this.applicationMail.appType
      ) {
        this.invalidNotification = true;
        return;
      }
    }
    this.invalidNotification = false;
  }

  tabChanged(event: MatTabChangeEvent): void {
    if (event.index === 0) this.showTags = false;
  }

  toggleMailType(mailType: string): void {
    // clear old texts and subjects if they are the prefilled default values
    if (
      this.previousMailType === MailType.USER_PRE_APPROVED_INVITE &&
      mailType !== this.previousMailType
    ) {
      for (const lang of this.languages) {
        this.translate.use(lang).subscribe(() => {
          const defaultMailText = this.translate.instant(
            'DIALOGS.NOTIFICATIONS_ADD_EDIT_MAIL.DEFAULT_PRE_APPROVED_MAIL_TEXT',
          );
          const defaultMailSubject = this.translate.instant(
            'DIALOGS.NOTIFICATIONS_ADD_EDIT_MAIL.DEFAULT_PRE_APPROVED_MAIL_SUBJECT',
          );
          if (this.inputFormGroup.get([`${lang}-plain-text`]).value === defaultMailText) {
            this.inputFormGroup.get([`${lang}-plain-text`]).setValue('');
          }
          if (this.inputFormGroup.get([`${lang}-plain-subject`]).value === defaultMailSubject) {
            this.inputFormGroup.get([`${lang}-plain-subject`]).setValue('');
          }
        });
      }
    }

    this.previousMailType = mailType as MailType;
    if (mailType === MailType.USER_PRE_APPROVED_INVITE) {
      for (const lang of this.languages) {
        if (
          !this.inputFormGroup.get([`${lang}-plain-text`]).value ||
          String(this.inputFormGroup.get([`${lang}-plain-text`]).value).length === 0
        )
          this.translate.use(lang).subscribe(() => {
            const defaultMailText = this.translate.instant(
              'DIALOGS.NOTIFICATIONS_ADD_EDIT_MAIL.DEFAULT_PRE_APPROVED_MAIL_TEXT',
            );
            const defaultMailSubject = this.translate.instant(
              'DIALOGS.NOTIFICATIONS_ADD_EDIT_MAIL.DEFAULT_PRE_APPROVED_MAIL_SUBJECT',
            );
            this.inputFormGroup.patchValue({ [`${lang}-plain-text`]: defaultMailText });
            this.inputFormGroup.patchValue({ [`${lang}-plain-subject`]: defaultMailSubject });
          });
      }
    }
    this.applicationMail.mailType = mailType as MailType;
    this.mailType.next(this.applicationMail.mailType);
  }

  /**
   * Update application mail with content from FormControl
   */
  private prepareNotification(): void {
    for (const lang of this.languages) {
      this.applicationMail.htmlMessage[lang].subject = this.inputFormGroup.get(
        `${lang}-html-subject`,
      ).value;
      this.applicationMail.htmlMessage[lang].text = this.inputFormGroup.get(
        `${lang}-html-text`,
      ).value;
      this.applicationMail.message[lang].subject = this.inputFormGroup.get(
        `${lang}-plain-subject`,
      ).value;
      this.applicationMail.message[lang].text = this.inputFormGroup.get(`${lang}-plain-text`).value;
    }
  }

  private checkEmptyContent(): void {
    for (const language of this.languages) {
      if (
        (this.inputFormGroup.get(`${language}-html-text`).value?.length > 0 &&
          this.inputFormGroup.get(`${language}-html-subject`).value?.length > 0) ||
        (this.inputFormGroup.get(`${language}-plain-text`).value?.length > 0 &&
          this.inputFormGroup.get(`${language}-plain-subject`).value?.length > 0)
      ) {
        this.noneFilled = false;
        return;
      }
    }
    this.noneFilled = true;
  }
}
