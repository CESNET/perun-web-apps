import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment-timezone';
import { MatDialog } from '@angular/material/dialog';
import { ChangeEmailDialogComponent } from '../../components/dialogs/change-email-dialog/change-email-dialog.component';
import {
  Attribute,
  AttributesManagerService,
  AuthzResolverService,
  UsersManagerService
} from '@perun-web-apps/perun/openapi';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';

@Component({
  selector: 'perun-web-apps-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  currentLang = 'en';
  languages = ['en', 'cz'];
  timeZones = moment.tz.names();

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
    private authzResolverService: AuthzResolverService,
    private attributesManagerService: AttributesManagerService,
    private usersManagerService:UsersManagerService
  ) {
  }

  userId: number;

  emailAttribute: Attribute;
  languageAttribute: Attribute;
  timezoneAttribute: Attribute;
  organizationAttribute: Attribute;

  email = '';
  fullName = '';
  organization = '';
  currentTimezone = '';

  ngOnInit() {
    this.authzResolverService.getPerunPrincipal().subscribe(principal => {
      this.userId = principal.userId;

      this.usersManagerService.getRichUserWithAttributes(this.userId).subscribe(richUser=>{
        // console.log(richUser.userAttributes.map(elem=>elem.friendlyName));
        // this.fullName = `${richUser.titleBefore?richUser.titleBefore:''} ${richUser.firstName} ${richUser.middleName?richUser.middleName+' ':''}${richUser.lastName}${richUser.titleAfter?' '+richUser.titleAfter:''}`;
        this.fullName = new UserFullNamePipe().transform(richUser);

        this.organizationAttribute = richUser.userAttributes.find(att => att.friendlyName === 'organization');
        // @ts-ignore
        this.organization = this.organizationAttribute.value;

        this.emailAttribute = richUser.userAttributes.find(att => att.friendlyName === 'preferredMail');
        // @ts-ignore
        this.email = this.emailAttribute.value;

        this.languageAttribute = richUser.userAttributes.find(att => att.friendlyName === 'preferredLanguage');
        // @ts-ignore
        this.currentLang = this.languageAttribute.value;
        this.translateService.use(this.currentLang);

        this.timezoneAttribute = richUser.userAttributes.find(att => att.friendlyName === 'timezone');
        // @ts-ignore
        this.currentTimezone = this.timezoneAttribute.value;
      });
    });
  }

  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.translateService.use(this.currentLang);

    // @ts-ignore
    this.languageAttribute.value = this.currentLang;
    this.attributesManagerService.setUserAttribute({ user: this.userId, attribute: this.languageAttribute }).subscribe(() => {
      // this.notificator.showSuccess("done");
    });

  }

  changeTimeZone(tz: string) {
    console.log(moment().tz(tz).format());
    this.currentTimezone = tz;

    // @ts-ignore
    this.timezoneAttribute.value = this.currentTimezone;
    this.attributesManagerService.setUserAttribute({ user: this.userId, attribute: this.timezoneAttribute }).subscribe(() => {
      // this.notificator.showSuccess("done");
    });
  }

  changeEmail() {
    const dialogRef = this.dialog.open(ChangeEmailDialogComponent, {
      width: '350px',
      data: { userId: this.userId, attribute: this.emailAttribute }
    });

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.getEmail();
      }
    });
  }
  getEmail() {
    this.attributesManagerService.getUserAttributeByName(this.userId, 'urn:perun:user:attribute-def:def:preferredMail').subscribe(attribute => {
      this.emailAttribute = attribute;
      // @ts-ignore
      this.email = attribute.value;
    });
  }
}
