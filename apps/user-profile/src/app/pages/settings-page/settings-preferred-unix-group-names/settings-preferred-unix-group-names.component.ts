import { Component, OnInit} from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { AddUnixGroupDialogComponent } from '../../../components/dialogs/add-unix-group-dialog/add-unix-group-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { RemoveStringValueDialogComponent } from '../../../components/dialogs/remove-string-value-dialog/remove-string-value-dialog.component';

@Component({
  selector: 'perun-web-apps-settings-preferred-unix-group-names',
  templateUrl: './settings-preferred-unix-group-names.component.html',
  styleUrls: ['./settings-preferred-unix-group-names.component.scss']
})
export class SettingsPreferredUnixGroupNamesComponent implements OnInit {

  constructor(private store: StoreService,
              private attributesManagerService: AttributesManagerService,
              private dialog: MatDialog,
              private translateService: TranslateService
  ) {
    translateService.get('PREFERRED_UNIX_GROUP_NAMES.REMOVE_DIALOG_DESCRIPTION').subscribe(value => this.removeDialogDescription = value);
    translateService.get('PREFERRED_UNIX_GROUP_NAMES.REMOVE_DIALOG_TITLE').subscribe(value => this.removeDialogTitle = value);
  }

  namespaces: string[] = [];
  userId = this.store.getPerunPrincipal().userId;
  groupNames: Map<string, string[]> = new Map<string, string[]>();
  groupNameAttributes: Attribute[] = new Array<Attribute>();

  displayedColumns = ['group'];
  dataSource: MatTableDataSource<string>;

  selectionList: string[][];

  removeDialogTitle: string;
  removeDialogDescription: string;

  ngOnInit() {
    this.namespaces = this.store.get('preferred_unix_group_names');
    this.dataSource = new MatTableDataSource<string>(this.namespaces);
    this.initSelection();
    this.namespaces.forEach(group => {
      this.getAttribute(group);
    });
  }

  private initSelection() {
    this.selectionList = new Array<string[]>(this.namespaces.length);
    for (let i = 0; i < this.namespaces.length; i++) {
      this.selectionList[i] = new Array<string>();
    }
  }

  getAttribute(namespace: string) {
    this.attributesManagerService.getUserAttributeByName(this.userId, `urn:perun:user:attribute-def:def:preferredUnixGroupName-namespace:${namespace}`).subscribe(names => {
      // @ts-ignore
      this.groupNames.set(namespace, names.value);
      this.groupNameAttributes.push(names);
    });
  }

  addGroupName(namespace: string) {
    const dialogRef = this.dialog.open(AddUnixGroupDialogComponent, {
      width: '600px',
      data: { namespace: namespace, userId: this.userId }
    });

    dialogRef.afterClosed().subscribe(added => {
      if (added) {
        this.getAttribute(namespace);
      }
    });
  }

  removeGroupName(namespace: string, index: number) {
    console.log(index);
    const dialogRef = this.dialog.open(RemoveStringValueDialogComponent, {
      width: '600px',
      data: {
        values: this.selectionList[index],
        attribute: this.groupNameAttributes[index],
        userId: this.userId,
        title: this.removeDialogTitle,
        description: this.removeDialogDescription
      }
    });

    dialogRef.afterClosed().subscribe(added => {
      if (added) {
        this.getAttribute(namespace);
      }
    });
  }

  hasGroups(namespace: string): boolean {
    return this.groupNames.get(namespace) && this.groupNames.get(namespace).length !== 0;
  }

  changeSelection(group: string, i: number) {
    if(this.selectionList[i].find(element => element === group)){
      this.selectionList[i] = this.selectionList[i].filter(element => element !== group)
    } else {
      this.selectionList[i].push(group);
    }
  }
}
