import {Component, HostBinding, OnInit} from '@angular/core';
import {openClose} from '../../../../../shared/animations/Animations';
import {ActivatedRoute} from '@angular/router';
import {NotificatorService} from '../../../../../core/services/common/notificator.service';
import {TranslateService} from '@ngx-translate/core';
import { AttributesService } from '@perun-web-apps/perun/services';
import { Attribute } from '@perun-web-apps/perun/models';
import { Urns } from '@perun-web-apps/perun/urns';
import { ApiRequestConfigurationService } from '../../../../../core/services/api/api-request-configuration.service';

@Component({
  selector: 'app-vo-settings-expiration',
  templateUrl: './vo-settings-expiration.component.html',
  styleUrls: ['./vo-settings-expiration.component.scss'],
  animations: [
    openClose
  ]
})
export class VoSettingsExpirationComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private attributesService: AttributesService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private apiRequest: ApiRequestConfigurationService
  ) {
    this.translate.get('VO_DETAIL.SETTINGS.EXPIRATION.SUCCESS_MESSAGE').subscribe(value => this.successMessage = value);
    this.translate.get('VO_DETAIL.SETTINGS.EXPIRATION.ERROR_MESSAGE').subscribe(value => this.errorMessage = value);
  }

  expirationAttribute: Attribute;

  successMessage: string;
  errorMessage: string;

  voId: number;

  ngOnInit() {
    this.route.parent.parent.params.subscribe(params => {
      this.voId = params['voId'];

      this.loadSettings();
    });
  }

  private loadSettings(): void {
    this.attributesService.getAttribute(this.voId, 'vo', Urns.VO_DEF_EXPIRATION_RULES).subscribe(attr => {
      this.expirationAttribute = attr;
    });
  }

  saveExpirationAttribute(attribute: Attribute) {
    // FIXME this might not work in case of some race condition (other request finishes sooner)
    this.apiRequest.dontHandleErrorForNext();

    this.attributesService.setAttribute(this.voId, 'vo', attribute, false).subscribe(() => {
        this.loadSettings();
        this.notificator.showSuccess(this.successMessage);
      }, error => {
      console.log(error);
      this.notificator.showRPCError(error, this.errorMessage);
    });
  }
}
