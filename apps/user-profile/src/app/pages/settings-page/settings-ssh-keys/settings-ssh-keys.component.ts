import { Component, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AddSshDialogComponent } from '../../../components/dialogs/add-ssh-dialog/add-ssh-dialog.component';
import { RemoveSshDialogComponent } from '../../../components/dialogs/remove-ssh-dialog/remove-ssh-dialog.component';

@Component({
  selector: 'perun-web-apps-settings-ssh-keys',
  templateUrl: './settings-ssh-keys.component.html',
  styleUrls: ['./settings-ssh-keys.component.scss']
})
export class SettingsSSHKeysComponent implements OnInit {

  constructor(private store: StoreService,
              private attributesManagerService: AttributesManagerService,
              private dialog: MatDialog
  ) {
  }

  adminKeys: string[] = [];
  userKeys: string[] = [];

  userUrn = 'urn:perun:user:attribute-def:def:sshPublicKey';
  adminUrn = 'urn:perun:user:attribute-def:def:sshPublicAdminKey';

  userKeyAttribute: Attribute;
  adminKeyAttribute: Attribute;

  userId: number;
  selection = new SelectionModel<string>(false, []);
  selectionAdmin = new SelectionModel<string>(false, []);

  ngOnInit() {
    this.userId = this.store.getPerunPrincipal().userId;

    this.getUserSSH();
    this.getAdminSSH();
  }

  addKey(admin: boolean) {
    const dialogRef = this.dialog.open(AddSshDialogComponent, {
      width: '800px',
      data: { attribute: admin ? this.adminKeyAttribute : this.userKeyAttribute, userId: this.userId }
    });

    dialogRef.afterClosed().subscribe(sshAdded => {
      if (sshAdded) {
        admin ? this.getAdminSSH() : this.getUserSSH();
      }
    });
  }

  removeKey(admin: boolean) {
    const dialogRef = this.dialog.open(RemoveSshDialogComponent, {
      width: '600px',
      data: {
        keys: admin ? this.selectionAdmin.selected : this.selection.selected,
        attribute: admin ? this.adminKeyAttribute : this.userKeyAttribute,
        userId: this.userId
      }
    });

    dialogRef.afterClosed().subscribe(sshAdded => {
      if (sshAdded) {
        admin ? this.getAdminSSH() : this.getUserSSH();
      }
    });
  }

  getUserSSH() {
    this.attributesManagerService.getUserAttributeByName(this.userId, this.userUrn).subscribe(sshKeys => {
      this.userKeyAttribute = sshKeys;
      // @ts-ignore
      this.userKeys = sshKeys.value;
    });
  }

  getAdminSSH() {
    this.attributesManagerService.getUserAttributeByName(this.userId, this.adminUrn).subscribe(sshKeys => {
      this.adminKeyAttribute = sshKeys;
      // @ts-ignore
      this.adminKeys = sshKeys.value;
    });
  }
}
