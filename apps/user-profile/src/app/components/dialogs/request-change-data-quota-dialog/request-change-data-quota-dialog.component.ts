import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { RichResource, User, Vo } from '@perun-web-apps/perun/openapi';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';

export interface RequestChangeDataQuotaDialogData {
  vo: Vo;
  resource: RichResource;
  user: User;
  currentQuota: string;
}

@Component({
  selector: 'perun-web-apps-request-change-data-quota-dialog',
  templateUrl: './request-change-data-quota-dialog.component.html',
  styleUrls: ['./request-change-data-quota-dialog.component.scss']
})
export class RequestChangeDataQuotaDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RequestChangeDataQuotaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: RequestChangeDataQuotaDialogData,
              // private rtMessagesService:RtMessagesService
  ) {
  }

  resource: string = '';
  currentQuota: string = '';
  reasonControl: FormControl;
  newValueControl: FormControl;
  units: string[] = ['MiB', 'GiB', 'TiB'];
  selectedUnit: string = 'GiB';

  ngOnInit(): void {
    this.resource = this.data.resource.name;
    this.currentQuota = this.data.currentQuota;
    this.reasonControl = new FormControl(null, [Validators.required]);
    this.newValueControl = new FormControl(null, [Validators.required, Validators.pattern('[1-9][0-9]*')])
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const subject = 'QUOTA: Change request';
    const name = new UserFullNamePipe().transform(this.data.user);
    // text: "QUOTA CHANGE REQUEST↵ ↵ User: Martin Kostka (user ID: 73916)↵ VO: VO_cuni_lf3 / 3. lékařská fakulta Univerzity Karlovy (vo ID: 2841)↵ Resource: du4:tape_tape:backup:cuni_lf3 (resource ID: 10964)↵ Data quota↵ Requested quota: 5G↵ Reason: a↵ ↵ ↵ -------------------------------------↵ Sent from Perun GUI"
    const text = `QUOTA CHANGE REQUEST↵ ↵ User: ${name} (user ID: ${this.data.user.id})↵ VO: ${this.data.vo.shortName} / ${this.data.vo.name} (vo ID: ${this.data.vo.id})↵ Resource: ${this.data.resource.name} (resource ID: ${this.data.resource.id})↵ Data quota↵ Requested quota: ${this.newValueControl.value}↵ Reason: ${this.reasonControl.value}↵ ↵ ↵ -------------------------------------↵ Sent from Perun GUI`;

    // this.rtMessagesService.sendMessageToRT('', subject, text).subscribe(() =>{
    //   console.log('done');
    // });
  }
}
