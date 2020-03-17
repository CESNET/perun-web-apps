import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
import { ApplicationForm, RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { ApplicationFormItem } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-vo-settings-application-form',
  templateUrl: './vo-settings-application-form.component.html',
  styleUrls: ['./vo-settings-application-form.component.scss']
})
export class VoSettingsApplicationFormComponent implements OnInit {

  static id = 'VoSettingsApplicationFormComponent';

  @HostBinding('class.router-component') true;

  constructor(
    private registrarManager: RegistrarManagerService,
    protected route: ActivatedRoute,
    private dialog: MatDialog,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private router: Router) {
  }

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
      this.registrarManager.getVoApplicationForm(voId).subscribe( form => {
        this.applicationForm = form;
        this.registrarManager.getFormItemsForVo(voId).subscribe( formItems => {
          // @ts-ignore
          // TODO reimplement this
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
        this.applicationFormItems = Object.assign([], success[0]);
        this.dialog.open(EditApplicationFormItemDialogComponent, {
          width: '600px',
          height: '600px',
          data: {voId: this.voId, applicationFormItem: success[1]}
        });
        this.itemsChanged = true;
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
    this.registrarManager.getFormItemsForVo(this.voId).subscribe( formItems => {
      // @ts-ignore
      // TODO reimplement this
      this.applicationFormItems = formItems;
      this.itemsChanged = false;
      this.loading = false;
    });
  }

  changeItems() {
    this.itemsChanged = true;
  }

  save() {
    let i = 0;
    for (const item of this.applicationFormItems) {
      item.ordnum = i;
      if (!item.forDelete) {
        i++
      }
    }
    console.log(this.applicationFormItems);
    // @ts-ignore
    this.registrarManager.updateFormItemsForVo({vo: this.voId, items: this.applicationFormItems}).subscribe( () => {
      this.translate.get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_APPLICATION_FORM_ITEMS_SUCCESS')
        .subscribe( successMessage => {
        this.notificator.showSuccess(successMessage);
      });
      this.updateFormItems();
    });
  }
}
