import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';
import { AlertComponent } from '@perun-web-apps/ui/alerts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  ApiRequestConfigurationService,
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
} from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AttributesManagerService, Group } from '@perun-web-apps/perun/openapi';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { FormsService } from '@perun-web-apps/perun/registrar-openapi';
import { ApplicationFormListNewRegComponent } from '../../../../components/application-form-list-new-reg/application-form-list-new-reg.component';
import { FormsModule } from '@angular/forms';
import { ApplicationFormBaseNewRegComponent } from '../../../../../shared/components/application-form-base-new-reg/application-form-base-new-reg.component';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    AlertComponent,
    MatDivider,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip,
    LoaderDirective,
    LoadingTableComponent,
    ApplicationFormListNewRegComponent,
    MatSlideToggle,
    FormsModule,
  ],
  standalone: true,
  selector: 'app-group-settings-application-form-new-reg',
  templateUrl: './group-settings-application-form-new-reg.component.html',
  styleUrls: ['./group-settings-application-form-new-reg.component.scss'],
})
export class GroupSettingsApplicationFormNewRegComponent extends ApplicationFormBaseNewRegComponent {
  static id = 'GroupSettingsApplicationFormComponent';

  @HostBinding('class.router-component') true;
  @ViewChild('autoRegToggle')
  autoRegToggle: MatSlideToggle;

  // Group-specific properties only
  noApplicationForm = false;
  createEmptyForm = false;
  autoRegistrationEnabled: boolean;
  embeddedGroupsItemSaved = false;
  group: Group;

  constructor(
    formsService: FormsService,
    dialog: MatDialog,
    notificator: NotificatorService,
    translate: TranslateService,
    private apiRequest: ApiRequestConfigurationService,
    router: Router,
    private guiAuthResolver: GuiAuthResolver,
    private attributesManager: AttributesManagerService,
    private entityStorageService: EntityStorageService,
  ) {
    super(formsService, dialog, notificator, translate, router);
  }

  protected get entityId(): string {
    return this.group.id.toString();
  }

  protected get entityType(): 'GROUP' {
    return 'GROUP';
  }

  protected get updatePolicy(): string {
    return 'group-updateFormItems_ApplicationForm_List<ApplicationFormItem>_policy';
  }

  protected get theme(): string {
    return 'group-theme';
  }

  // Base class calls this during ngOnInit and refreshItems
  protected checkAuth(): void {
    this.group = this.entityStorageService.getEntity();
    this.editAuth = this.guiAuthResolver.isAuthorized(
      'group-updateFormItems_ApplicationForm_List<ApplicationFormItem>_policy',
      [this.group],
    );
    this.createEmptyForm = this.guiAuthResolver.isAuthorized(
      'createApplicationFormInGroup_Group_policy',
      [this.group],
    );
  }

  protected getPreviewRoute(): unknown[] {
    return [
      '/organizations',
      this.group.voId,
      'groups',
      this.group.id,
      'settings',
      'applicationForm',
      'preview',
    ];
  }
}
