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
  selection: number[] = new Array<number>();
  removeDialogTitle: string;
  removeDialogDescription: string;

  ngOnInit() {
    this.userId = this.store.getPerunPrincipal().userId;
    this.getAttribute();
  }

  addShell() {
    // console.log(this.shells);
    this.shells.push('/bin/bash');

    this.prefShellsAttribute.value = this.shells;
    this.attributesManagerService.setUserAttribute({user: this.userId, attribute: this.prefShellsAttribute}).subscribe(()=>{
      console.log("done");
    });
  }

  removeShell() {
    const dialogRef = this.dialog.open(RemoveStringValueDialogComponent, {
      width: '600px',
      data: {
        values: this.selection.map(index => this.shells[index]),
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

  changeSelection(i: number) {
    const index = this.selection.indexOf(i,0);
    if(index > -1) {
      this.selection.splice(index,1);
    } else {
      this.selection.push(i);
    }
    console.log(this.selection);
  }

  changeValue(defShell: string, i: number) {
    this.shells[i] = defShell;
    this.prefShellsAttribute.value = this.shells;
    this.attributesManagerService.setUserAttribute({user: this.userId, attribute: this.prefShellsAttribute}).subscribe(()=>{
      console.log("done");
    });
  }
}
