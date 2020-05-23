import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {TranslateService} from '@ngx-translate/core';
import {NotificatorService} from '@perun-web-apps/perun/services';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';

export interface DeleteGroupDialogData {
  voId: number;
  groups: Group[];
}

@Component({
  selector: 'app-delete-group-dialog',
  templateUrl: './delete-group-dialog.component.html',
  styleUrls: ['./delete-group-dialog.component.scss']
})
export class DeleteGroupDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteGroupDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DeleteGroupDialogData,
              private notificator: NotificatorService,
              private translate: TranslateService,
              private groupService: GroupsManagerService) { }

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Group>;

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Group>(this.data.groups);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    this.groupService.deleteGroups(this.data.groups.map(elem => elem.id), true).subscribe( () => {
      this.translate.get('DIALOGS.DELETE_GROUP.SUCCESS').subscribe(successMessage => {
        this.notificator.showSuccess(successMessage);
        this.dialogRef.close(true);
      });
    });
  }
}
