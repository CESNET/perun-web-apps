import { Component, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RemoveStringValueDialogComponent } from '../../../components/dialogs/remove-string-value-dialog/remove-string-value-dialog.component';

@Component({
  selector: 'perun-web-apps-settings-preferred-shells',
  templateUrl: './settings-preferred-shells.component.html',
  styleUrls: ['./settings-preferred-shells.component.scss']
})
export class SettingsPreferredShellsComponent implements OnInit {

  constructor(private store: StoreService,
              private attributesManagerService: AttributesManagerService,
              private dialog: MatDialog,
              private translateService: TranslateService
  ) {
    translateService.get('PREFERRED_SHELLS.REMOVE_DIALOG_DESCRIPTION').subscribe(value => this.removeDialogDescription = value);
    translateService.get('PREFERRED_SHELLS.REMOVE_DIALOG_TITLE').subscribe(value => this.removeDialogTitle = value);
  }

  defaultShells: string[] = ['/bin/bash', '/bin/csh', '/bin/ksh', '/bin/sh', '/bin/zsh'];
  userId: number;
  prefShellsAttribute: Attribute;
  shells: string[] = [];
  removeDialogTitle: string;
  removeDialogDescription: string;

  ngOnInit() {
    this.userId = this.store.getPerunPrincipal().userId;
    this.getAttribute();
  }

  addShell() {
    this.shells.push('/bin/bash');

    this.prefShellsAttribute.value = this.shells;
    this.attributesManagerService.setUserAttribute({user: this.userId, attribute: this.prefShellsAttribute}).subscribe(()=>{
      console.log("done");
    });
  }

  removeShell(i: number) {
    this.shells.splice(i,1);
    const dialogRef = this.dialog.open(RemoveStringValueDialogComponent, {
      width: '600px',
      data: {
        values: [],
        attribute: this.prefShellsAttribute,
        userId: this.userId,
        title: this.removeDialogTitle,
        description: this.removeDialogDescription
      }
    });

    dialogRef.afterClosed().subscribe(sshAdded => {
      if (sshAdded) {
        this.getAttribute();
      }
    });
  }

  private getAttribute() {
    this.attributesManagerService.getUserAttributeByName(this.userId, 'urn:perun:user:attribute-def:def:preferredShells').subscribe(attribute => {
      this.prefShellsAttribute = attribute;

      // @ts-ignore
      this.shells = this.prefShellsAttribute.value ? this.prefShellsAttribute.value : [];
    })
  }

  changeValue() {
    this.prefShellsAttribute.value = this.shells;
    this.attributesManagerService.setUserAttribute({user: this.userId, attribute: this.prefShellsAttribute}).subscribe(()=>{
      console.log("done");
    });
  }
}
