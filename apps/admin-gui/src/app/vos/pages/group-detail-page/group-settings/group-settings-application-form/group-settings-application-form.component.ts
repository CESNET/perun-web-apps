import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {NotificatorService} from '../../../../../core/services/common/notificator.service';
import {TranslateService} from 'ngx-polygloat';
import {
  AddApplicationFormItemDialogComponent
} from '../../../../../shared/components/dialogs/add-application-form-item-dialog/add-application-form-item-dialog.component';
import {
  EditApplicationFormItemDialogComponent
} from '../../../../../shared/components/dialogs/edit-application-form-item-dialog/edit-application-form-item-dialog.component';
import {
  ApplicationFormCopyItemsDialogComponent
} from '../../../../../shared/components/dialogs/application-form-copy-items-dialog/application-form-copy-items-dialog.component';
import {
  UpdateApplicationFormDialogComponent
} from '../../../../../shared/components/dialogs/update-application-form-dialog/update-application-form-dialog.component';
import { ApplicationForm, RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { ApiRequestConfigurationService } from '../../../../../core/services/api/api-request-configuration.service';
import { ApplicationFormItem } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-group-settings-application-form',
  templateUrl: './group-settings-application-form.component.html',
  styleUrls: ['./group-settings-application-form.component.scss']
})
export class GroupSettingsApplicationFormComponent implements OnInit {

  static id = 'GroupSettingsApplicationFormComponent';

  @HostBinding('class.router-component') true;

  constructor(
    private registrarManager: RegistrarManagerService,
    protected route: ActivatedRoute,
    private dialog: MatDialog,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private apiRequest: ApiRequestConfigurationService,
    private router: Router) {
  }

  loading = false;
  applicationForm: ApplicationForm;
  applicationFormItems: ApplicationFormItem[] = [];
  voId: number;
  groupId: number;
  noApplicationForm = false;
  itemsChanged = false;

  ngOnInit() {
    this.loading = true;
    this.route.parent.parent.params.subscribe(params => {
      this.voId = params['voId'];
      this.groupId = params['groupId'];
      // FIXME this might not work in case of some race condition (other request finishes sooner)
      this.apiRequest.dontHandleErrorForNext();
      this.registrarManager.getGroupApplicationForm(this.groupId).subscribe( form => {
        this.applicationForm = form;
        this.registrarManager.getFormItemsForGroup(this.groupId).subscribe(formItems => {
          // @ts-ignore
          // TODO reimplement this so we can use the model from openapi
          this.applicationFormItems = formItems;
          this.loading = false;
        });
      }, error => {
        if (error.error.name === 'FormNotExistsException') {
          this.noApplicationForm = true;
          this.loading = false;
        } else {
          this.notificator.showRPCError(error.error);
        }
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
          data: {voId: this.voId,
            groupId: this.groupId,
            applicationFormItem: success[1]}
        });
        this.itemsChanged = true;
      }
    });
  }

  copy() {
    const dialog = this.dialog.open(ApplicationFormCopyItemsDialogComponent, {
      width: '500px',
      data: {voId: this.voId, groupId: this.groupId}
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
        this.translate.get('GROUP_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_SETTINGS_SUCCESS').subscribe( successMessage => {
          this.notificator.showSuccess(successMessage);
        });
        this.applicationForm = newForm;
      }
    });
  }

  preview() {
    this.router.navigate(['/organizations', this.voId, 'groups', this.groupId, 'settings', 'applicationForm', 'preview'],
      {queryParams: {applicationFormItems: JSON.stringify(this.applicationFormItems)}});
  }

  updateFormItems() {
    this.loading = true;
    this.registrarManager.getFormItemsForGroup(this.groupId).subscribe( formItems => {
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

  createEmptyApplicationForm() {
    this.registrarManager.createApplicationFormInGroup(this.groupId).subscribe( () => {
      this.noApplicationForm = false;
      this.ngOnInit();
    });
  }

  save() {
    let i = 0;
    for (const item of this.applicationFormItems) {
      item.ordnum = i;
      if (!item.forDelete) {
        i++
      }
    }
    // @ts-ignore
    // TODO reimplement this
    this.registrarManager.updateFormItemsForGroup({group: this.groupId, items: this.applicationFormItems}).subscribe( () => {
      this.translate.get('VO_DETAIL.SETTINGS.APPLICATION_FORM.CHANGE_APPLICATION_FORM_ITEMS_SUCCESS')
        .subscribe( successMessage => {
          this.notificator.showSuccess(successMessage);
        });
      this.updateFormItems();
    });
  }
}
