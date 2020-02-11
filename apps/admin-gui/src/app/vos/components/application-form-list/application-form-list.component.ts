import {Component, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import {MatDialog, MatTable} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  DeleteApplicationFormItemDialogComponent
} from '../../../shared/components/dialogs/delete-application-form-item-dialog/delete-application-form-item-dialog.component';
import {NotificatorService} from '../../../core/services/common/notificator.service';
import {TranslateService} from '@ngx-translate/core';
import {
  EditApplicationFormItemDialogComponent
} from '../../../shared/components/dialogs/edit-application-form-item-dialog/edit-application-form-item-dialog.component';
import { RegistrarService } from '@perun-web-apps/perun/services';
import { ApplicationForm } from '@perun-web-apps/perun/openapi';
import { ApplicationFormItem } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-application-form-list',
  templateUrl: './application-form-list.component.html',
  styleUrls: ['./application-form-list.component.scss']
})
export class ApplicationFormListComponent implements OnChanges {

  constructor(private registrarService: RegistrarService,
              private dialog: MatDialog,
              private notificator: NotificatorService,
              private translate: TranslateService) { }

  @Input()
  loading: boolean;

  @Input()
  applicationForm: ApplicationForm;

  @Input()
  applicationFormItems: ApplicationFormItem[] = [];

  @Output()
  applicationFormItemsChange = new EventEmitter<ApplicationFormItem[]>();

  itemsChanged: number[] = [];

  dataSource = this.applicationFormItems;
  displayedColumns: string[] = ['drag', 'shortname', 'type', 'preview', 'edit', 'delete'];
  @ViewChild('table', { static: false }) table: MatTable<ApplicationFormItem>;

  mapForCombobox: Map<number, string> = new Map();
  dragDisabled = true;

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = this.applicationFormItems;

  }

  edit(applicationFormItem: ApplicationFormItem) {
    const editDialog = this.dialog.open(EditApplicationFormItemDialogComponent, {
      width: '600px',
      height: '600px',
      data: {voId: this.applicationForm.vo.id,
        group: this.applicationForm.group,
        applicationFormItem: applicationFormItem}
    });
    editDialog.afterClosed().subscribe((success) => {
      if (success) {
        this.itemsChanged.push(applicationFormItem.id);
        this.applicationFormItemsChange.emit();
      }
    });
  }

  delete(applicationFormItem: ApplicationFormItem) {
    const dialog = this.dialog.open(DeleteApplicationFormItemDialogComponent, {
      width: '500px'
    });
    dialog.afterClosed().subscribe(deleteItem => {
      if (deleteItem) {
        applicationFormItem.forDelete = true;
        if (applicationFormItem.id === 0) {
          this.applicationFormItems.splice(this.applicationFormItems.indexOf(applicationFormItem), 1);
          this.table.renderRows();
        }
        this.applicationFormItemsChange.emit();
      }
    });
  }

  drop(event: CdkDragDrop<ApplicationFormItem[]>) {
    this.dragDisabled = true;
    const prevIndex = this.applicationFormItems.indexOf(event.item.data);
    moveItemInArray(this.applicationFormItems, prevIndex, event.currentIndex);
    this.itemsChanged.push(this.applicationFormItems[event.currentIndex].id);
    this.applicationFormItemsChange.emit();
    this.table.renderRows();
  }

  getLocalizedOptions(applicationFormItem: ApplicationFormItem): string[] {
    if (applicationFormItem.i18n[this.translate.getDefaultLang()]) {
      const options = applicationFormItem.i18n[this.translate.getDefaultLang()].options;
      if (options !== null && options !== '') {
        const labels: string[] = [];
        for (const item of options.split('|')) {
          labels.push(item.split('#')[1]);
        }
        return labels;
      }
    }
    return [];
  }

  getLocalizedLabel(applicationFormItem: ApplicationFormItem): string {
    if (applicationFormItem.i18n[this.translate.getDefaultLang()]) {
      return applicationFormItem.i18n[this.translate.getDefaultLang()].label;
    }
    return applicationFormItem.shortname;
  }

  restore(applicationFormItem: ApplicationFormItem) {
    applicationFormItem.forDelete = false;
  }
}
