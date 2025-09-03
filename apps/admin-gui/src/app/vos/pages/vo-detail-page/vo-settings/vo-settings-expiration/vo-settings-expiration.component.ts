import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { openClose } from '@perun-web-apps/perun/animations';
import {
  ApiRequestConfigurationService,
  EntityStorageService,
  NotificatorService,
} from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { Urns } from '@perun-web-apps/perun/urns';
import { Attribute, AttributesManagerService, Vo } from '@perun-web-apps/perun/openapi';
import { RPCError } from '@perun-web-apps/perun/models';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { ExpirationSettingsComponent } from '../../../../components/expiration-settings/expiration-settings.component';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [CommonModule, LoaderDirective, ExpirationSettingsComponent, LoadingTableComponent],
  standalone: true,
  selector: 'app-vo-settings-expiration',
  templateUrl: './vo-settings-expiration.component.html',
  styleUrls: ['./vo-settings-expiration.component.scss'],
  animations: [openClose],
})
export class VoSettingsExpirationComponent implements OnInit {
  @HostBinding('class.router-component') true;

  expirationAttribute: Attribute;
  loading = false;

  private successMessage: string;
  private errorMessage: string;

  private vo: Vo;

  constructor(
    private attributesManager: AttributesManagerService,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private apiRequest: ApiRequestConfigurationService,
    private entityStorageService: EntityStorageService,
  ) {
    this.translate
      .get('VO_DETAIL.SETTINGS.EXPIRATION.SUCCESS_MESSAGE')
      .subscribe((value: string) => (this.successMessage = value));
    this.translate
      .get('VO_DETAIL.SETTINGS.EXPIRATION.ERROR_MESSAGE')
      .subscribe((value: string) => (this.errorMessage = value));
  }

  ngOnInit(): void {
    this.loading = true;
    this.vo = this.entityStorageService.getEntity();
    this.loadSettings();
  }

  saveExpirationAttribute(attribute: Attribute): void {
    this.loading = true;
    // FIXME this might not work in case of some race condition (other request finishes sooner)
    this.apiRequest.dontHandleErrorForNext();

    this.attributesManager.setVoAttribute({ vo: this.vo.id, attribute: attribute }).subscribe({
      next: () => {
        this.loadSettings();
        this.notificator.showSuccess(this.successMessage);
        this.loading = false;
      },
      error: (error: RPCError) => {
        this.notificator.showRPCError(error, this.errorMessage);
        this.loading = false;
      },
    });
  }

  private loadSettings(): void {
    this.loading = true;
    this.attributesManager
      .getVoAttributeByName(this.vo.id, Urns.VO_DEF_EXPIRATION_RULES)
      .subscribe((attr) => {
        this.expirationAttribute = attr;
        this.loading = false;
      });
  }
}
