import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddAuthImgDialogComponent } from '../../../components/dialogs/add-auth-img-dialog/add-auth-img-dialog.component';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { RemoveStringValueDialogComponent } from '@perun-web-apps/perun/dialogs';
import { TranslateService } from '@ngx-translate/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'perun-web-apps-settings-authentication',
  templateUrl: './settings-authentication.component.html',
  styleUrls: ['./settings-authentication.component.scss'],
})
export class SettingsAuthenticationComponent implements OnInit {
  @ViewChild('toggle') toggle: MatSlideToggle;

  removeDialogTitle: string;
  imgAtt: Attribute;
  imageSrc = '';
  removeDialogDescription: string;
  mfaUrl = '';
  displayImageBlock: boolean;
  loadingImg = false;
  saveImgSuccess = '';
  removeImgSuccess = '';

  constructor(
    private dialog: MatDialog,
    private attributesManagerService: AttributesManagerService,
    private store: StoreService,
    private translate: TranslateService,
    private notificatorService: NotificatorService
  ) {
    translate
      .get('AUTHENTICATION.DELETE_IMG_DIALOG_TITLE')
      .subscribe((res: string) => (this.removeDialogTitle = res));
    translate
      .get('AUTHENTICATION.DELETE_IMG_DIALOG_DESC')
      .subscribe((res: string) => (this.removeDialogDescription = res));
    translate
      .get('AUTHENTICATION.SAVE_IMG_SUCCESS')
      .subscribe((res: string) => (this.saveImgSuccess = res));
    translate
      .get('AUTHENTICATION.REMOVE_IMG_SUCCESS')
      .subscribe((res: string) => (this.removeImgSuccess = res));
  }

  ngOnInit(): void {
    const mfa = this.store.getProperty('mfa');

    this.translate.onLangChange.subscribe(() => {
      this.translate
        .get('AUTHENTICATION.DELETE_IMG_DIALOG_TITLE')
        .subscribe((res: string) => (this.removeDialogTitle = res));
      this.translate
        .get('AUTHENTICATION.DELETE_IMG_DIALOG_DESC')
        .subscribe((res: string) => (this.removeDialogDescription = res));
      this.mfaUrl = this.translate.currentLang === 'en' ? mfa.url_en : mfa.url_cs;
    });

    this.mfaUrl = this.translate.currentLang === 'en' ? mfa.url_en : mfa.url_cs;
    this.displayImageBlock = this.store.getProperty('mfa').enable_security_image;
    if (this.displayImageBlock) {
      this.loadImage();
    }
  }

  loadImage(): void {
    this.loadingImg = true;
    const imgAttributeName = this.store.getProperty('mfa').security_image_attribute;
    this.attributesManagerService
      .getUserAttributeByName(this.store.getPerunPrincipal().userId, imgAttributeName)
      .subscribe(
        (attr) => {
          if (!attr) {
            this.attributesManagerService
              .getAttributeDefinitionByName(imgAttributeName)
              .subscribe((att) => {
                this.imgAtt = att as Attribute;
              });
          } else {
            this.imgAtt = attr;
            this.imageSrc = this.imgAtt.value as string;
          }
          this.loadingImg = false;
        },
        (e) => {
          console.error(e);
          this.loadingImg = false;
        }
      );
  }

  onAddImg(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = { theme: 'user-theme', attribute: this.imgAtt };

    const dialogRef = this.dialog.open(AddAuthImgDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notificatorService.showSuccess(this.saveImgSuccess);
        this.loadImage();
      }
    });
  }

  onDeleteImg(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      doNotShowValues: true,
      attribute: this.imgAtt,
      userId: this.store.getPerunPrincipal().userId,
      title: this.removeDialogTitle,
      description: this.removeDialogDescription,
    };

    const dialogRef = this.dialog.open(RemoveStringValueDialogComponent, config);

    dialogRef.afterClosed().subscribe((imgRemoved) => {
      if (imgRemoved) {
        this.notificatorService.showSuccess(this.removeImgSuccess);
        this.loadImage();
      }
    });
  }

  redirectToMfa(): void {
    window.open(this.mfaUrl, '_blank');
  }
}
