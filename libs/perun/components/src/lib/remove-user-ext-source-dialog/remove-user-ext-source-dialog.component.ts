import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RichUserExtSource, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';

export interface RemoveUserExtSourceDialogData {
  showSuccess: boolean;
  userId: number;
  extSources: RichUserExtSource[];
  theme: string;
}

@Component({
  selector: 'perun-web-apps-remove-user-ext-source-dialog',
  templateUrl: './remove-user-ext-source-dialog.component.html',
  styleUrls: ['./remove-user-ext-source-dialog.component.scss']
})
export class RemoveUserExtSourceDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<RemoveUserExtSourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RemoveUserExtSourceDialogData,
    private usersManagerService: UsersManagerService,
    private translate: TranslateService,
    private notificator: NotificatorService
  ) {
    translate.get('SHARED_LIB.PERUN.COMPONENTS.REMOVE_USER_EXT_SOURCE.SUCCESS').subscribe(res => this.successMessage = res);
  }

  successMessage: string;
  theme: string;
  force = false;
  loading: boolean;

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<RichUserExtSource>;

  ngOnInit() {
    this.theme = this.data.theme;
    this.dataSource = new MatTableDataSource<RichUserExtSource>(this.data.extSources);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    this.loading = true;
    this.usersManagerService.removeUserExtSource(this.data.userId, this.data.extSources[0].userExtSource.id,this.force).subscribe(() =>{
      this.loading = false;
      if(this.data.showSuccess){
        this.notificator.showSuccess(this.successMessage);
      }
      this.dialogRef.close(true);
    }, () => this.loading = false);
  }

}
