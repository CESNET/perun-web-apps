import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { MailType } from '@perun-web-apps/perun/openapi';
import { BehaviorSubject } from 'rxjs';
import { TagSectionComponent } from '../tag-section/tag-section.component';
import { CdkScrollable } from '@angular/cdk/overlay';

@Component({
  imports: [CommonModule, CdkScrollable, TagSectionComponent],
  standalone: true,
  selector: 'app-tag-bar',
  templateUrl: './tag-bar.component.html',
  styleUrls: ['./tag-bar.component.scss'],
})
export class TagBarComponent implements OnInit {
  @Input() notificationType: BehaviorSubject<MailType>;

  tagsDescriptionsMappings = new Map<string, string>();
  notificationTypeAllowedTags: Record<string, string[]>;
  availableTagsWithDescriptions: string[][];

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.notificationTypeAllowedTags = this.store.getProperty('notification_tags');
    this.getTagsDescriptionsMappings();
    this.notificationType.subscribe((notificationType) => {
      this.availableTagsWithDescriptions = this.notificationTypeAllowedTags[notificationType].map(
        (key) => [key, this.tagsDescriptionsMappings.get(key)],
      );
    });
  }

  getTagsDescriptionsMappings(): void {
    this.tagsDescriptionsMappings.set('appId', 'APPID_DESCRIPTION');
    this.tagsDescriptionsMappings.set('actor', 'ACTOR_DESCRIPTION');
    this.tagsDescriptionsMappings.set('extSource', 'EXTSOURCE_DESCRIPTION');
    this.tagsDescriptionsMappings.set('voName', 'VONAME_DESCRIPTION');
    this.tagsDescriptionsMappings.set('groupName', 'GROUPNAME_DESCRIPTION');
    this.tagsDescriptionsMappings.set('mailFooter', 'MAILFOOTER_DESCRIPTION');
    this.tagsDescriptionsMappings.set('htmlMailFooter', 'HTMLMAILFOOTER_DESCRIPTION');
    this.tagsDescriptionsMappings.set('errors', 'ERRORS_DESCRIPTION');
    this.tagsDescriptionsMappings.set('customMessage', 'CUSTOMMESSAGE_DESCRIPTION');
    this.tagsDescriptionsMappings.set('autoApproveError', 'AUTOAPPROVEERROR_DESCRIPTION');
    this.tagsDescriptionsMappings.set('fromApp-itemName', 'FROMAPPITEMNAME_DESCRIPTION');

    this.tagsDescriptionsMappings.set('firstName', 'FIRSTNAME_DESCRIPTION');
    this.tagsDescriptionsMappings.set('lastName', 'LASTNAME_DESCRIPTION');
    this.tagsDescriptionsMappings.set('displayName', 'DISPLAYNAME_DESCRIPTION');
    this.tagsDescriptionsMappings.set('mail', 'MAIL_DESCRIPTION');
    this.tagsDescriptionsMappings.set('phone', 'PHONE_DESCRIPTION');
    this.tagsDescriptionsMappings.set('login-namespace', 'LOGINNAMESPACE_DESCRIPTION');
    this.tagsDescriptionsMappings.set('membershipExpiration', 'MEMBERSHIPEXPIRATION_DESCRIPTION');

    this.tagsDescriptionsMappings.set('validationLink', 'VALIDATIONLINK_DESCRIPTION');
    this.tagsDescriptionsMappings.set('validationLink-krb', 'VALIDATIONKRB_DESCRIPTION');
    this.tagsDescriptionsMappings.set('validationLink-fed', 'VALIDATIONFED_DESCRIPTION');
    this.tagsDescriptionsMappings.set('validationLink-cert', 'VALIDATIONCERT_DESCRIPTION');
    this.tagsDescriptionsMappings.set('validationLink-non', 'VALIDATIONNON_DESCRIPTION');
    this.tagsDescriptionsMappings.set('redirectUrl', 'REDIRECTURL_DESCRIPTION');

    this.tagsDescriptionsMappings.set('appGuiUrl', 'APPGUIURL_DESCRIPTION');
    this.tagsDescriptionsMappings.set('appGuiUrl-krb', 'APPGUIURLKRB_DESCRIPTION');
    this.tagsDescriptionsMappings.set('appGuiUrl-fed', 'APPGUIURLFED_DESCRIPTION');
    this.tagsDescriptionsMappings.set('appGuiUrl-cert', 'APPGUIURLCERT_DESCRIPTION');
    this.tagsDescriptionsMappings.set('appGuiUrl-non', 'APPGUIURLNON_DESCRIPTION');

    this.tagsDescriptionsMappings.set('appDetailUrl', 'APPDETAILURL_DESCRIPTION');
    this.tagsDescriptionsMappings.set('appDetailUrl-krb', 'APPDETAILURLKRB_DESCRIPTION');
    this.tagsDescriptionsMappings.set('appDetailUrl-fed', 'APPDETAILURLFED_DESCRIPTION');
    this.tagsDescriptionsMappings.set('appDetailUrl-cert', 'APPDETAILURLCERT_DESCRIPTION');
    this.tagsDescriptionsMappings.set('appDetailUrl-newGUI', 'APPDETAILURLNEWGUI_DESCRIPTION');

    this.tagsDescriptionsMappings.set('perunGuiUrl', 'PERUNGUIURL_DESCRIPTION');
    this.tagsDescriptionsMappings.set('perunGuiUrl-krb', 'PERUNGUIURLKRB_DESCRIPTION');
    this.tagsDescriptionsMappings.set('perunGuiUrl-fed', 'PERUNGUIURLFED_DESCRIPTION');
    this.tagsDescriptionsMappings.set('perunGuiUrl-cert', 'PERUNGUIURLCERT_DESCRIPTION');
    this.tagsDescriptionsMappings.set('perunGuiUrl-newGUI', 'PERUNGUINEWGUI_DESCRIPTION');

    this.tagsDescriptionsMappings.set('displayName', 'USER_INVITATIONS_DISPLAYNAME_DESCRIPTION');
    this.tagsDescriptionsMappings.set('mailFooter', 'USER_INVITATIONS_MAILFOOTER_DESCRIPTION');
    this.tagsDescriptionsMappings.set(
      'htmlMailFooter',
      'USER_INVITATIONS_HTMLMAILFOOTER_DESCRIPTION',
    );
    this.tagsDescriptionsMappings.set('invitationLink', 'INVITATIONLINK_DESCRIPTION');
    this.tagsDescriptionsMappings.set('invitationLink-krb', 'INVITATIONLINKKRB_DESCRIPTION');
    this.tagsDescriptionsMappings.set('invitationLink-fed', 'INVITATIONLINKFED_DESCRIPTION');
    this.tagsDescriptionsMappings.set('invitationLink-cert', 'INVITATIONLINKCERT_DESCRIPTION');
    this.tagsDescriptionsMappings.set('invitationLink-non', 'INVITATIONLINKNON_DESCRIPTION');

    this.tagsDescriptionsMappings.set('displayName', 'USER_INVITATIONS_DISPLAYNAME_DESCRIPTION');
    this.tagsDescriptionsMappings.set(
      'preapprovedInvitationLink',
      'USER_PREAPPROVED_INVITATIONS_LINK_DESCRIPTION',
    );
    this.tagsDescriptionsMappings.set(
      'expirationDate',
      'USER_PREAPPROVED_INVITATIONS_EXPIRATION_DESCRIPTION',
    );
    this.tagsDescriptionsMappings.set(
      'senderName',
      'USER_PREAPPROVED_INVITATIONS_SENDER_NAME_DESCRIPTION',
    );
  }
}
