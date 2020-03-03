import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '../../../../core/services/common/notificator.service';
import { Vo, VosManagerService } from '@perun-web-apps/perun/openapi';

export interface RemoveVoDialogData {
  vos: Vo[]
  theme: string;
}

@Component({
  selector: 'app-remove-vo-dialog',
  templateUrl: './remove-vo-dialog.component.html',
  styleUrls: ['./remove-vo-dialog.component.scss']
})
export class RemoveVoDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<RemoveVoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RemoveVoDialogData,
    private notificator: NotificatorService,
    private voService: VosManagerService,
    private translate: TranslateService
  ) {
    translate.get('DIALOGS.REMOVE_VO.SUCCESS').subscribe(value => this.successMessage = value);
  }

  successMessage: string;
  theme: string;
  force = false;
  loading: boolean;

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Vo>;

  ngOnInit() {
    this.theme = this.data.theme;
    this.dataSource = new MatTableDataSource<Vo>(this.data.vos);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    this.loading = true;
    //TODO Works for one Vo at the time, in future there may be need to remove  more Vos at once
    this.voService.deleteVo(this.data.vos[0].id, this.force).subscribe(() => {
      this.notificator.showSuccess(this.successMessage);
      this.loading = false;
      this.dialogRef.close(true);
    }, () => this.loading = false);

  }

}
