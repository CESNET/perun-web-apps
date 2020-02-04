import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {
  UpdateApplicationFormDialogComponent
} from '../../../../../shared/components/dialogs/update-application-form-dialog/update-application-form-dialog.component';
import {NotificatorService} from '../../../../../core/services/common/notificator.service';
import {TranslateService} from '@ngx-translate/core';
import {
  ApplicationFormCopyItemsDialogComponent
} from '../../../../../shared/components/dialogs/application-form-copy-items-dialog/application-form-copy-items-dialog.component';
import {
  AddApplicationFormItemDialogComponent
} from '../../../../../shared/components/dialogs/add-application-form-item-dialog/add-application-form-item-dialog.component';
import {
  EditApplicationFormItemDialogComponent
} from '../../../../../shared/components/dialogs/edit-application-form-item-dialog/edit-application-form-item-dialog.component';
import { RegistrarService } from '@perun-web-apps/perun/services';
import { ApplicationForm } from '@perun-web-apps/perun/openapi';
import { ApplicationFormItem } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-vo-settings-application-form',
  templateUrl: './vo-settings-application-form.component.html',
  styleUrls: ['./vo-settings-application-form.component.scss']
})
export class VoSettingsApplicationFormComponent implements OnInit {

  @HostBinding('class.router-component') true;

  static id = 'VoSettingsApplicationFormComponent';

  constructor(private registrarService: RegistrarService,
              protected route: ActivatedRoute,
              private dialog: MatDialog,
              private notificator: NotificatorService,
              private translate: TranslateService,
              private router: Router) { }

  loading = false;
  applicationForm: ApplicationForm;
  applicationFormItems: ApplicationFormItem[] = [];
  itemsChanged = false;
  voId: number;

  ngOnInit() {
    this.loading = true;
    this.route.parent.parent.params.subscribe(params => {
      const voId = params['voId'];
      this.voId = voId;
      this.registrarService.getApplicationFormForVo(voId).subscribe( form => {
        this.applicationForm = form;
        this.registrarService.getFormItemsForVo(voId).subscribe( formItems => {
          this.applicationFormItems = formItems;
          this.loading = false;
        });
      });
    });
  }

  add() {
    const dialog = this.dialog.open(AddApplicationFormItemDialogComponent, {
      width: '500px',
      data: {applicationFormItems: this.applicationFormItems}
    });
    dialog.afterClosed().subscribe( success => {
      // success is field contains of two items: first is applicationFormItems with new item in it,
      // second item is new Application Form Item
      if (success) {
        this.changeItems(success[0]);
        const editDialog = this.dialog.open(EditApplicationFormItemDialogComponent, {
          width: '600px',
          height: '600px',
          data: {voId: this.voId, applicationFormItem: success[1], applicationFormItems: success[0]}
        });
        editDialog.afterClosed().subscribe((applicationFormItems) => {
          if (applicationFormItems) {
            this.applicationFormItems = applicationFormItems;
          }
        });
      }
    });
  }

  copy() {
    const dialog = this.dialog.open(ApplicationFormCopyItemsDialogComponent, {
      width: '500px',
      data: {voId: this.voId}
    });
    dialog.afterClosed().subscribe( copyFrom => {
      if (copyFrom) {
        this.updateFormItems();
      }
    });
  }

  settings() {
    const dialog = this.dialog.open(UpdateApplicationFormDialogComponent, {
      width: '400px',
      data: {applicationForm: this.applicationForm}
    });
    dialog.afterClosed().subscribe( newForm => {
      if (newForm) {
        this.translate.get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_SETTINGS_SUCCESS').subscribe( successMessage => {
          this.notificator.showSuccess(successMessage);
        });
        this.applicationForm = newForm;
      }
    });
  }

  preview() {
    this.router.navigate(['/organizations', this.voId, 'settings', 'applicationForm', 'preview'],
      {queryParams: {applicationFormItems: JSON.stringify(this.applicationFormItems)}});
  }

  updateFormItems() {
    this.loading = true;
    this.registrarService.getFormItemsForVo(this.voId).subscribe( formItems => {
      this.applicationFormItems = formItems;
      this.itemsChanged = false;
      this.loading = false;
    });
  }

  changeItems(applicationFormItemsChange: ApplicationFormItem[]) {
    this.applicationFormItems = applicationFormItemsChange;
    this.itemsChanged = true;
  }

  save() {
    let i = 0;
    for (let item of this.applicationFormItems) {
      item.ordnum = i;
      if (!item.forDelete) {
        i++
      }
    }
    this.registrarService.updateFormItemsForVo(this.voId, this.applicationFormItems).subscribe( () => {
      this.translate.get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_APPLICATION_FORM_ITEMS_SUCCESS')
        .subscribe( successMessage => {
        this.notificator.showSuccess(successMessage);
      });
      this.updateFormItems();
    });
  }
}
