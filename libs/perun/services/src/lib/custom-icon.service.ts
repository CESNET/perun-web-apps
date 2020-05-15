import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

export class CustomIcon  {
  url: string;
  name: string;
}

@Injectable()
export class CustomIconService {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  customIcons: CustomIcon[] = [
    {
      url: 'assets/img/PerunWebImages/refresh_tab-black.svg',
      name: 'perun-refresh-enabled'
    },
    {
      url: 'assets/img/PerunWebImages/refresh_tab-grey.svg',
      name: 'perun-refresh-disabled'
    },
    {
      url: 'assets/img/PerunWebImages/manage_facility_white.svg',
      name: 'perun-manage-facility'
    },
    {
      url: 'assets/img/PerunWebImages/vo-white.svg',
      name: 'perun-vo'
    },
    {
      url: 'assets/img/PerunWebImages/user-white.svg',
      name: 'perun-user'
    },
    {
      url: 'assets/img/PerunWebImages/perun_admin-white.svg',
      name: 'perun-perun-admin'
    },
    {
      url: 'assets/img/PerunWebImages/group-white.svg',
      name: 'perun-group'
    },
    {
      url: 'assets/img/PerunWebImages/attributes-white.svg',
      name: 'perun-attributes'
    },
    {
      url: 'assets/img/PerunWebImages/preview-white.svg',
      name: 'perun-preview'
    },
    {
      url: 'assets/img/PerunWebImages/module_dependencies.svg',
      name: 'perun-module-dependencies'
    },
    {
      url: 'assets/img/PerunWebImages/user_destination_relationship.svg',
      name: 'perun-user-destination-relationship'
    },
    {
      url: 'assets/img/PerunWebImages/settings2-white.svg',
      name: 'perun-settings2'
    },
    {
      url: 'assets/img/PerunWebImages/attributes-white.svg',
      name: 'perun-attributes'
    },
    {
      url: 'assets/img/PerunWebImages/applications-white.svg',
      name: 'perun-applications'
    },
    {
      url: 'assets/img/PerunWebImages/manager-white.svg',
      name: 'perun-manager'
    },
    {
      url: 'assets/img/PerunWebImages/application_form-white.svg',
      name: 'perun-application-form'
    },
    {
      url: 'assets/img/PerunWebImages/notification-white.svg',
      name: 'perun-notification'
    },
    {
      url: 'assets/img/PerunWebImages/invite_member-white.svg',
      name: 'perun-invite-member'
    },
    {
      url: 'assets/img/PerunWebImages/service_identity-white.svg',
      name: 'perun-service-identity'
    },
    {
      url: 'assets/img/PerunWebImages/create1-white.svg',
      name: 'perun-create1'
    },
    {
      url: 'assets/img/PerunWebImages/resource-white.svg',
      name: 'perun-resource'
    },
    {
      url: 'assets/img/PerunWebImages/resource_tags-white.svg',
      name: 'perun-resource-tags'
    },
    {
      url: 'assets/img/PerunWebImages/resources_state-white.svg',
      name: 'perun-resources-state'
    },
    {
      url: 'assets/img/PerunWebImages/external_sources-white.svg',
      name: 'perun-external-sources'
    },
    // TESTING PURPOSES
    {
      url: 'assets/img/settings1-blue.svg',
      name: 'settings-blue'
    },
    {
      url: 'assets/img/PerunWebImages/service_destination-blue.svg',
      name: 'perun-service_destination'
    },
  ];

  registerPerunRefreshIcon() {
    this.customIcons.forEach(ci => {
      this.matIconRegistry.addSvgIcon(
        ci.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(ci.url)
      )
    });
  }
}
