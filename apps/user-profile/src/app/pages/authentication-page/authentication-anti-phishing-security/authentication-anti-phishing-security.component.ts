import { Component, OnInit } from '@angular/core';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddAuthTextDialogComponent } from '../../../components/dialogs/add-auth-text-dialog/add-auth-text-dialog.component';
import { RemoveStringValueDialogComponent } from '@perun-web-apps/perun/dialogs';
import {
  NotificatorService,
  PerunTranslateService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'perun-web-apps-authentication-anti-phishing-security',
  templateUrl: './authentication-anti-phishing-security.component.html',
  styleUrls: ['./authentication-anti-phishing-security.component.scss'],
})
export class AuthenticationAntiPhishingSecurityComponent implements OnInit {
  textAtt: Attribute;
  textAttrName: string;

  loading = false;

  constructor(
    private dialog: MatDialog,
    private attributesManagerService: AttributesManagerService,
    private store: StoreService,
    private translate: PerunTranslateService,
    private notificatorService: NotificatorService,
  ) {}

  ngOnInit(): void {
    this.textAttrName = this.store.getProperty('mfa').security_text_attribute;
    this.loadSecurityAttribute(this.textAttrName).subscribe((attr) => {
      this.textAtt = attr;
    });
  }

  loadSecurityAttribute(attributeName: string): Observable<Attribute> {
    this.loading = true;
    const subject = new Subject<Attribute>();
    this.attributesManagerService
      .getUserAttributeByName(this.store.getPerunPrincipal().userId, attributeName)
      .subscribe({
        next: (attr) => {
          if (!attr) {
            this.attributesManagerService
              .getAttributeDefinitionByName(attributeName)
              .subscribe((att) => {
                subject.next(att as Attribute);
              });
          } else {
            subject.next(attr);
          }
          this.loading = false;
        },
        error: (e) => {
          console.error(e);
          this.loading = false;
        },
      });
    return subject.asObservable();
  }

  onAddAttribute(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = { theme: 'user-theme', attribute: this.textAtt };

    const dialogRef: MatDialogRef<AddAuthTextDialogComponent> = this.dialog.open(
      AddAuthTextDialogComponent,
      config,
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notificatorService.showSuccess(
          this.translate.instant(`AUTHENTICATION.SAVE_TEXT_SUCCESS`),
        );
        this.loadSecurityAttribute(this.textAttrName).subscribe((attr) => {
          this.textAtt = attr;
        });
      }
    });
  }

  onDeleteAttribute(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';

    const removeDialogTitle = this.translate.instant(`AUTHENTICATION.DELETE_TEXT_DIALOG_TITLE`);
    const removeDialogDescription = this.translate.instant(
      `AUTHENTICATION.DELETE_TEXT_DIALOG_DESC`,
    );
    config.data = {
      doNotShowValues: true,
      attribute: this.textAtt,
      userId: this.store.getPerunPrincipal().userId,
      title: removeDialogTitle,
      description: removeDialogDescription,
    };

    const dialogRef = this.dialog.open(RemoveStringValueDialogComponent, config);

    dialogRef.afterClosed().subscribe((attrRemoved) => {
      if (attrRemoved) {
        this.notificatorService.showSuccess(
          this.translate.instant(`AUTHENTICATION.REMOVE_TEXT_SUCCESS`),
        );
        this.loadSecurityAttribute(this.textAttrName).subscribe((attr) => {
          this.textAtt = attr;
        });
      }
    });
  }
}
