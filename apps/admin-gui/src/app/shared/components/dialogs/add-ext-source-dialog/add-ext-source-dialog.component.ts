import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { VoService } from '@perun-web-apps/perun/services';
import { ExtSource } from '@perun-web-apps/perun/models';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificatorService } from '../../../../core/services/common/notificator.service';
import { TranslateService } from '@ngx-translate/core';

export interface AddExtSourceDialogData {
  voId: number
  theme: string;
  voExtSources: ExtSource[];
}

@Component({
  selector: 'app-add-ext-source-dialog',
  templateUrl: './add-ext-source-dialog.component.html',
  styleUrls: ['./add-ext-source-dialog.component.scss']
})
export class AddExtSourceDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddExtSourceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: AddExtSourceDialogData,
              private voService: VoService,
              private notificator: NotificatorService,
              private translate: TranslateService) {
    this.translate.get('DIALOGS.ADD_EXT_SOURCES.SUCCESS_ADDED').subscribe(result => this.successMessage = result);
  }

  theme: string;
  extSources: ExtSource[] = [];
  selection = new SelectionModel<ExtSource>(true, []);
  loading: boolean;
  filterValue = '';
  processing: boolean;
  successMessage: string;

  ngOnInit() {
    this.theme = this.data.theme;
    this.voService.getExtSources().subscribe(sources => {
      this.extSources = sources.filter(source => !this.data.voExtSources.includes(source));
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  onAdd() {
    for (const source of this.selection.selected) {
      this.voService.addExtSources(this.data.voId, source.id).subscribe(_ => {
        this.notificator.showSuccess(this.successMessage + source.name);
        this.dialogRef.close(true);
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
