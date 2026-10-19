import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDivider } from '@angular/material/divider';
import { AlertComponent } from '@perun-web-apps/ui/alerts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
} from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Vo } from '@perun-web-apps/perun/openapi';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { FormsService } from '@perun-web-apps/perun/registrar-openapi';
import { ApplicationFormListNewRegComponent } from '../../../../components/application-form-list-new-reg/application-form-list-new-reg.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
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
  selector: 'app-vo-settings-application-form-new-reg',
  templateUrl: './vo-settings-application-form-new-reg.component.html',
  styleUrls: ['./vo-settings-application-form-new-reg.component.scss'],
})
export class VoSettingsApplicationFormNewRegComponent extends ApplicationFormBaseNewRegComponent {
  static id = 'VoSettingsApplicationFormNewRegComponent';
  @HostBinding('class.router-component') true;

  displayedColumns: string[] = [];
  private vo: Vo;

  constructor(
    formsService: FormsService,
    dialog: MatDialog,
    notificator: NotificatorService,
    translate: TranslateService,
    router: Router,
    private authResolver: GuiAuthResolver, // Note: kept original name
    private entityStorageService: EntityStorageService,
  ) {
    super(formsService, dialog, notificator, translate, router);
  }

  protected get entityId(): string {
    return this.vo.id.toString();
  }

  protected get entityType(): 'VO' {
    return 'VO';
  }

  protected get updatePolicy(): string {
    return 'vo-updateFormItems_ApplicationForm_List<ApplicationFormItem>_policy';
  }

  protected get theme(): string {
    return 'vo-theme';
  }

  // Base class calls this; implements original setAuthRights logic
  protected checkAuth(): void {
    this.vo = this.entityStorageService.getEntity();
    this.editAuth = this.authResolver.isAuthorized(
      'vo-updateFormItems_ApplicationForm_List<ApplicationFormItem>_policy',
      [this.vo],
    );
    // Original logic preserved exactly
    this.displayedColumns = this.editAuth
      ? ['drag', 'shortname', 'type', 'disabled', 'hidden', 'preview', 'edit', 'delete']
      : ['shortname', 'type', 'disabled', 'hidden', 'preview'];
  }

  protected getPreviewRoute(): unknown[] {
    return ['/organizations', this.vo.id, 'settings', 'applicationForm', 'preview'];
  }
}
