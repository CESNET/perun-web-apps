import { CustomTranslatePipe, GetAttrValueFromAttributesPipe } from '@perun-web-apps/perun/pipes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  RegistrarManagerService,
  RichUserExtSource,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltip } from '@angular/material/tooltip';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import {
  MiddleClickRouterLinkDirective,
  QueryParamsHandlingDirective,
} from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CustomTranslatePipe,
    TranslateModule,
    UiAlertsModule,
    MatProgressSpinnerModule,
    GetAttrValueFromAttributesPipe,
    MatFormFieldModule,
    MatTooltip,
    QueryParamsHandlingDirective,
    MiddleClickRouterLinkDirective,
  ],
  standalone: true,
  selector: 'perun-web-apps-orcid-page',
  templateUrl: './orcid-page.component.html',
  styleUrls: ['./orcid-page.component.scss'],
})
export class OrcidPageComponent implements OnInit {
  ORCID_ATTR_NAME = 'eduPersonOrcid';
  MAIL_ATTR_NAME = 'mail';
  NAME_ATTR_NAME = 'cn';
  ID_ATTR_NAME = 'epuid';

  orcidExtSources: RichUserExtSource[] = [];

  userId: number;
  loading: boolean;
  orcidExtSourceName: string;

  displayedColumns = ['mail', 'cn', 'eduPersonOrcid'];
  constructor(
    private usersManagerService: UsersManagerService,
    private storage: StoreService,
    private registrarManagerService: RegistrarManagerService,
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    this.userId = this.storage.getPerunPrincipal().userId;
    this.orcidExtSourceName = this.storeService.getProperty('orcid_ext_source_name');
    this.refreshTables();
  }

  refreshTables(): void {
    this.loading = true;
    this.orcidExtSources = [];
    this.usersManagerService.getRichUserExtSources(this.userId).subscribe((userExtSources) => {
      this.orcidExtSources = userExtSources.filter(
        (ues) => ues.userExtSource.extSource.name === this.orcidExtSourceName,
      );
      this.loading = false;
    });
  }

  addOrcidIdentity(): void {
    this.registrarManagerService.getConsolidatorToken().subscribe((token) => {
      const consolidatorUrl = this.storage.getProperty('consolidator_url_orcid');
      window.location.href = `${consolidatorUrl}?target_url=${window.location.href}&token=${token}`;
    });
  }

  redirectToOrcid(orcidExtSource: RichUserExtSource): void {
    window.open(
      String(
        orcidExtSource.attributes.find((attr) => attr.friendlyName === this.ORCID_ATTR_NAME).value,
      ),
      '_blank',
    );
  }
}
