import { Component, OnInit} from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { AttributesManagerService} from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { AddUnixGroupDialogComponent } from '../../../components/dialogs/add-unix-group-dialog/add-unix-group-dialog.component';
import { RemoveUnixGroupDialogComponent } from '../../../components/dialogs/remove-unix-group-dialog/remove-unix-group-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'perun-web-apps-settings-preferred-unix-group-names',
  templateUrl: './settings-preferred-unix-group-names.component.html',
  styleUrls: ['./settings-preferred-unix-group-names.component.scss']
})
export class SettingsPreferredUnixGroupNamesComponent implements OnInit {

  constructor(private store: StoreService,
              private attributesManagerService: AttributesManagerService,
              private dialog: MatDialog) {
  }

  namespaces: string[] = [];
  userId = this.store.getPerunPrincipal().userId;
  groupNames: Map<string, string[]> = new Map<string, string[]>();

  displayedColumns = ['group'];
  dataSource: MatTableDataSource<string>;

  selectionList: string[][];

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
    const dialogRef = this.dialog.open(RemoveUnixGroupDialogComponent, {
      width: '600px',
      data: {
        groups: this.selectionList[index],
        namespace: namespace,
        userId: this.userId
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
