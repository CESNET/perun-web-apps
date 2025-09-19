import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { downloadData, emailRegexString } from '@perun-web-apps/perun/utils';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { StoreService } from '@perun-web-apps/perun/services';
import {
  InputInviteToGroupFromCsv,
  InvitationsManagerService,
} from '@perun-web-apps/perun/openapi';
import { formatDate, CommonModule } from '@angular/common';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface BulkInvitePreapprovedMembersDialogData {
  theme: string;
  voId: number;
  groupId: number;
}

interface OutputData {
  email: string;
  status: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatDialogModule,
    UiAlertsModule,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-bulk-invite-preapproved-members-dialog',
  templateUrl: './bulk-invite-preapproved-members-dialog.component.html',
  styleUrls: ['./bulk-invite-preapproved-members-dialog.component.scss'],
})
export class BulkInvitePreapprovedMembersDialogComponent implements OnInit {
  invitedMembers = new FormControl('', [Validators.required, this.userInputValidator()]);
  languages = this.store.getProperty('supported_languages');
  currentLanguage = 'en';
  loading = false;
  state = 'input';
  finishedWithErrors: boolean;
  resultData: { [p: string]: string };
  minDate: Date;
  expirationControl = new FormControl<Date>(null);
  url: FormControl<string> = new FormControl<string>(null);

  constructor(
    public dialogRef: MatDialogRef<BulkInvitePreapprovedMembersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BulkInvitePreapprovedMembersDialogData,
    private store: StoreService,
    private invitationsManager: InvitationsManagerService,
  ) {}

  private static didSomeInviteFail(resultData: { [p: string]: string }): boolean {
    for (const key in resultData) {
      if (resultData[key] !== 'OK') {
        return true;
      }
    }
    return false;
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    const monthFromNow = new Date();
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);
    this.expirationControl.setValue(monthFromNow);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    const listOfMembers = this.invitedMembers.value.split('\n');
    const parsedMembers: string[] = [];
    for (const line of listOfMembers) {
      parsedMembers.push(this.parseMemberLine(line));
    }

    const inputSendInvitationsFromCsv: InputInviteToGroupFromCsv = {
      invitationData: parsedMembers,
      vo: this.data.voId,
      group: this.data.groupId,
      expiration: formatDate(this.expirationControl.value, 'yyyy-MM-dd', 'en-GB'),
      language: this.currentLanguage,
      redirectUrl: this.url.value,
    };

    this.invitationsManager.inviteToGroupFromCsv(inputSendInvitationsFromCsv).subscribe({
      next: (resultData) => {
        this.state = 'results';
        this.finishedWithErrors =
          BulkInvitePreapprovedMembersDialogComponent.didSomeInviteFail(resultData);
        this.resultData = resultData;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  downloadCsv(): void {
    downloadData(this.generateOutputData(this.resultData), 'csv', 'member-invites');
  }

  generateOutputData(data: { [p: string]: string }): OutputData[] {
    const result: OutputData[] = [];

    for (const key in data) {
      result.push({ email: key, status: data[key] });
    }

    return result;
  }

  private parseMemberLine(line: string): string {
    const trimLine = line.trim();
    if (trimLine === '') {
      return '';
    }
    const memberAttributes = trimLine.split(';');

    if (memberAttributes.length !== 2) {
      //check if all attributes are filled
      return 'format';
    }
    if (!memberAttributes[0].trim().match(emailRegexString)) {
      //check if the email is valid email
      return 'email';
    }

    if (memberAttributes[1].trim().length === 0) {
      return 'name';
    }

    let finalString = '';
    for (const memberAttribute of memberAttributes) {
      finalString += memberAttribute.trim() + ';';
    }
    return finalString.slice(0, -1);
  }

  private userInputValidator(): ValidatorFn {
    return (control: FormControl<string>): { [key: string]: { [key: string]: string } } | null => {
      const listOfMembers: string[] = control.value.split('\n');
      for (const line of listOfMembers) {
        const parsedLine: string = this.parseMemberLine(line);
        // cut line in case of very long input
        let helperLine = line;
        if (line.length > 25) {
          helperLine = line.substring(0, 25) + '...';
        }
        if (parsedLine === 'format') {
          return { invalidFormat: { value: helperLine } };
        }
        if (parsedLine === 'email') {
          return { invalidEmail: { value: helperLine } };
        }

        if (parsedLine === 'name') {
          return { invalidName: { value: helperLine } };
        }
      }

      return null;
    };
  }
}
