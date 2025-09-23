import { MatTooltip } from '@angular/material/tooltip';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AttributesManagerService,
  RegistrarManagerService,
  RichUser,
  RichUserExtSource,
  UserExtSource,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { RemoveUserExtSourceDialogComponent } from '@perun-web-apps/perun/dialogs';
import { LinkerResult, OpenLinkerService } from '@perun-web-apps/lib-linker';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Urns } from '@perun-web-apps/perun/urns';
import { UserExtSourcesListComponent, UsersListComponent } from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CustomTranslatePipe,
    TranslateModule,
    MatTooltip,
    UserExtSourcesListComponent,
    LoaderDirective,
    LoadingTableComponent,
    UsersListComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-identities-page',
  templateUrl: './identities-page.component.html',
  styleUrls: ['./identities-page.component.scss'],
})
export class IdentitiesPageComponent implements OnInit {
  idpExtSources: RichUserExtSource[] = [];
  certExtSources: RichUserExtSource[] = [];
  otherExtSources: RichUserExtSource[] = [];
  serviceIdentities: RichUser[] = [];
  idpExtSourcesTemp: RichUserExtSource[] = [];
  certExtSourcesTemp: RichUserExtSource[] = [];
  otherExtSourcesTemp: RichUserExtSource[] = [];
  idpSelection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>(true, []);
  certSelection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>(true, []);
  otherSelection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>(true, []);
  serviceIdentitiesSelection: SelectionModel<RichUser> = new SelectionModel<RichUser>(true, []);

  loginIdp = 'IDENTITIES.LOGIN_IDP';
  extSourceNameCert = 'IDENTITIES.EXT_SOURCE_NAME_CERT';
  loginCert = 'IDENTITIES.LOGIN_CERT';
  extSourceNameOther = 'IDENTITIES.EXT_SOURCE_NAME_OTHER';

  userId: number;
  loading: boolean;
  displayCertificates: boolean;

  displayedColumnsIdp = ['select', 'extSourceName', 'login', 'mail', 'lastAccess'];
  displayedColumnsCert = ['select', 'extSourceName', 'login', 'lastAccess'];
  displayedColumnsOther = ['extSourceName', 'login', 'lastAccess'];
  displayedColumnsService = ['user', 'name'];

  constructor(
    private usersManagerService: UsersManagerService,
    private storage: StoreService,
    private dialog: MatDialog,
    private attributesManagerService: AttributesManagerService,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private registrarManagerService: RegistrarManagerService,
    private openLinkerService: OpenLinkerService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.iconRegistry.addSvgIcon(
      'perun-service-identity-black',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/PerunWebImages/service_identity-black.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.userId = this.storage.getPerunPrincipal().userId;
    this.displayCertificates = this.storage.getProperty('display_identity_certificates');

    this.refreshTables();
  }

  refreshTables(): void {
    this.loading = true;
    this.idpExtSourcesTemp = [];
    this.certExtSourcesTemp = [];
    this.otherExtSourcesTemp = [];
    this.usersManagerService.getRichUserExtSources(this.userId).subscribe((userExtSources) => {
      this.usersManagerService
        .getSpecificUsersByUser(this.userId)
        .subscribe((serviceIdentities) => {
          this.serviceIdentities = serviceIdentities as RichUser[];
          let count = userExtSources.length;
          userExtSources.forEach((ues) => {
            this.attributesManagerService
              .getUserExtSourceAttributesByNames(ues.userExtSource.id, [
                Urns.UES_SOURCE_IDP_NAME,
                Urns.UES_DEF_MAIL,
              ])
              .subscribe((attributes) => {
                attributes
                  .filter((attr) => attr.baseFriendlyName === 'mail' && attr.value === null)
                  .map((attr) => ues.attributes.push(attr));
                let sourceName: string;
                attributes
                  .filter((attr) => attr.baseFriendlyName === 'sourceIdPName' && attr?.value)
                  .map((attr) => (sourceName = attr.value as string));
                if (sourceName) {
                  ues.userExtSource.extSource.name = sourceName;
                  count--;
                  this.loading = count !== 0;
                  this.addToList(ues);
                } else {
                  this.attributesManagerService
                    .getUserExtSourceAttributeByName(
                      ues.userExtSource.id,
                      Urns.UES_IDP_ORGANIZATION_NAME,
                    )
                    .subscribe((orgName) => {
                      count--;
                      if (orgName?.value) {
                        ues.userExtSource.extSource.name = orgName.value as string;
                      }
                      this.loading = count !== 0;
                      this.addToList(ues);
                    });
                }
              });
          });
        });
    });
  }

  removeIdentity(selection: SelectionModel<UserExtSource>): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      theme: 'user-theme',
      userId: this.userId,
      extSources: selection.selected,
    };

    const dialogRef = this.dialog.open(RemoveUserExtSourceDialogComponent, config);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        selection.clear();
        this.refreshTables();
      }
    });
  }

  addIdentity(cert: boolean): void {
    if (this.storage.getProperty('use_new_consolidator')) {
      this.openLinkerService.openLinkerWindow((result: LinkerResult) => {
        if (result === 'TOKEN_EXPIRED') {
          location.reload();
        } else if (result === 'OK') {
          this.notificator.showSuccess(
            this.translate.instant('IDENTITIES.SUCCESSFULLY_ADDED') as string,
          );
          this.refreshTables();
        } else if (result === 'MESSAGE_SENT_TO_SUPPORT') {
          this.notificator.showSuccess(
            this.translate.instant('IDENTITIES.MESSAGE_SENT_TO_SUPPORT') as string,
          );
        }
      });
    } else {
      this.registrarManagerService.getConsolidatorToken().subscribe((token) => {
        let consolidatorUrl = this.storage.getProperty('consolidator_url');
        if (cert) {
          consolidatorUrl = this.storage.getProperty('consolidator_url_cert');
        }
        window.location.href = `${consolidatorUrl}?target_url=${window.location.href}&token=${token}`;
      });
    }
  }

  private addToList(ues: RichUserExtSource): void {
    if (ues.userExtSource.extSource.type.endsWith('Idp')) {
      this.idpExtSourcesTemp.push(ues);
    } else if (ues.userExtSource.extSource.type.endsWith('X509')) {
      this.certExtSourcesTemp.push(ues);
    } else {
      this.otherExtSourcesTemp.push(ues);
    }
    if (!this.loading) {
      this.idpExtSources = this.idpExtSourcesTemp;
      this.certExtSources = this.certExtSourcesTemp;
      this.otherExtSources = this.otherExtSourcesTemp;
    }
  }
}
