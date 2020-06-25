import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacilitiesManagerService, Host } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';

export interface RemoveHostDialogData {
  theme: string;
  facilityId: number;
  hosts: Host[];
}

@Component({
  selector: 'app-remove-host-dialog',
  templateUrl: './remove-host-dialog.component.html',
  styleUrls: ['./remove-host-dialog.component.scss']
})

export class RemoveHostDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RemoveHostDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: RemoveHostDialogData,
              public facilitiesManager: FacilitiesManagerService,
              private notificator: NotificatorService,
              private translate: TranslateService) { }

  theme: string;
  hosts: Host[];
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Host>;

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.hosts = this.data.hosts;
    this.dataSource = new MatTableDataSource<Host>(this.data.hosts);
  }

  onConfirm(){
    this.facilitiesManager.removeHosts(this.data.facilityId, this.hosts.map(m => m.id)).subscribe(() => {
      this.notificator.showSuccess(this.translate.instant('DIALOGS.REMOVE_HOST.SUCCESS'));
      this.dialogRef.close(true);
    });
  }

  onCancel(){
    this.dialogRef.close(false);
  }

}
