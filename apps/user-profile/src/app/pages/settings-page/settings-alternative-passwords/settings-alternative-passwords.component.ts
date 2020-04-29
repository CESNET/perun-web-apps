import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { StoreService } from '@perun-web-apps/perun/services';
import { Attribute, AttributesManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ShowGeneratedPasswordDialogComponent } from '../../../components/dialogs/show-generated-password-dialog/show-generated-password-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { RemoveAltPasswordDialogComponent } from '../../../components/dialogs/remove-alt-password-dialog/remove-alt-password-dialog.component';

@Component({
  selector: 'perun-web-apps-settings-alternative-passwords',
  templateUrl: './settings-alternative-passwords.component.html',
  styleUrls: ['./settings-alternative-passwords.component.scss']
})
export class SettingsAlternativePasswordsComponent implements OnInit {

  constructor(private store: StoreService,
              private attributesManagerService: AttributesManagerService,
              private dialog: MatDialog,
              private translateService: TranslateService,
              private usersManagerService: UsersManagerService) {
    translateService.get('ALT_PASSWORDS.REMOVE_DIALOG_DESCRIPTION').subscribe(value => this.removeDialogDescription = value);
    translateService.get('ALT_PASSWORDS.REMOVE_DIALOG_TITLE').subscribe(value => this.removeDialogTitle = value);
    translateService.get('ALERTS.NO_ALT_PASSWORDS').subscribe(value => this.alertText = value);
    translateService.get('ALT_PASSWORDS.HEADER_COLUMN').subscribe(value => this.headerColumnText = value);
  }

  altPasswordCtrl = new FormControl(null, [Validators.required]);
  userId = this.store.getPerunPrincipal().userId;
  removeDialogTitle: string;
  removeDialogDescription: string;
  passwordDescriptions = new Set<string>();
  displayedValues: string[] = [];
  selection = new SelectionModel<string>(false, []);
  altPasswordsAttribute: Attribute;
  alertText: string;
  headerColumnText: string;
  loading: boolean;

  ngOnInit() {
    this.getAltPasswords();
  }

  createPassword() {
    const password = this.generatePassword();
    this.usersManagerService.createAlternativePassword(this.userId, this.altPasswordCtrl.value, 'einfra', password).subscribe(() => {
      this.dialog.open(ShowGeneratedPasswordDialogComponent, {
        width: '600px',
        data: { password: password }
      });
      this.getAltPasswords();
      this.altPasswordCtrl.setValue('');
    });
  }

  generatePassword(): string {
    let length = 16,
      charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      retVal = '';
    let i = 0, n = charset.length;
    for (; i < length; ++i) {
      retVal += charset.charAt(Math.random() * n);
    }
    return retVal;
  }

  private getAltPasswords() {
    this.loading = true;
    this.attributesManagerService.getUserAttributeByName(this.userId, `urn:perun:user:attribute-def:def:altPasswords:einfra`).subscribe(att => {
      this.altPasswordsAttribute = att;
      const foo = Object.keys(att.value);
      this.passwordDescriptions = new Set<string>(foo);
      this.displayedValues = Array.from(this.passwordDescriptions.values());
      this.loading = false;
    });
  }

  alreadyContainsValue(value: string) {
    return this.passwordDescriptions.has(value);
  }

  removeAltPasswords() {
    console.log(this.selection.selected);
    const dialogRef = this.dialog.open(RemoveAltPasswordDialogComponent, {
      width: '600px',
      data: {
        description: this.selection.selected,
        passwordId: this.altPasswordsAttribute.value[this.selection.selected[0]],
        userId: this.userId
      }
    });

    dialogRef.afterClosed().subscribe(added => {
      if (added) {
        this.getAltPasswords();
        this.selection.clear();
      }
    });
  }
}
