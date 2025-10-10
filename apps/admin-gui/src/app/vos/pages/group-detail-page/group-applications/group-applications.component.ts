import {
  ApplicationActionsComponent,
  AppAction,
} from '../../../../shared/components/application-actions/application-actions.component';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import {
  Attribute,
  AttributeDefinition,
  AttributesManagerService,
  Group,
} from '@perun-web-apps/perun/openapi';
import {
  TABLE_GROUP_APPLICATIONS_DETAILED,
  TABLE_GROUP_APPLICATIONS_NORMAL,
} from '@perun-web-apps/config/table-config';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';

import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { ApplicationsListColumnsChangeDialogComponent } from '../../../../shared/components/dialogs/applications-list-columns-change-dialog/applications-list-columns-change-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [CommonModule, ApplicationActionsComponent],
  standalone: true,
  selector: 'app-group-applications',
  templateUrl: './group-applications.component.html',
  styleUrls: ['./group-applications.component.scss'],
})
export class GroupApplicationsComponent implements OnInit {
  static id = 'GroupApplicationsComponent';
  @HostBinding('class.router-component') true;

  @ViewChild(ApplicationActionsComponent) applicationActions: ApplicationActionsComponent;

  group: Group;

  authRights: AppAction = {
    approve: false,
    reject: false,
    delete: false,
    resend: false,
    columnSettings: false,
  };

  tableId = TABLE_GROUP_APPLICATIONS_NORMAL;
  detailTableId = TABLE_GROUP_APPLICATIONS_DETAILED;

  fedAttrs: AttributeDefinition[] = [];
  viewPreferences$: Observable<Attribute>;

  constructor(
    private entityStorageService: EntityStorageService,
    private attributeService: AttributesManagerService,
    private dialog: MatDialog,
    private authResolver: GuiAuthResolver,
    private cacheHelperService: CacheHelperService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.group = this.entityStorageService.getEntity();
    this.setAuthRights();
    this.attributeService
      .getIdpAttributeDefinitions()
      .subscribe((attrDefs: AttributeDefinition[]) => {
        attrDefs.forEach((attr) => {
          if (!this.fedAttrs.includes(attr)) {
            this.fedAttrs.push(attr);
          }
          this.viewPreferences$ = this.attributeService.getGroupAttributeByName(
            this.group.id,
            'urn:perun:group:attribute-def:def:applicationViewPreferences',
          );
        });
      });

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === GroupApplicationsComponent.id) {
          this.applicationActions.refreshTable();
        }
      });
  }

  setColumns(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = {
      columns: [],
      groupId: this.group.id,
      voId: this.group.voId,
      theme: 'group-theme',
    };

    const dialogRef = this.dialog.open(ApplicationsListColumnsChangeDialogComponent, config);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        // Reset reference to Observable, this makes the async pipe automatically unsubscribe from the old one
        // and subscribe to the new one
        this.viewPreferences$ = this.attributeService.getGroupAttributeByName(
          this.group.id,
          'urn:perun:group:attribute-def:def:applicationViewPreferences',
        );
      }
    });
  }

  setAuthRights(): void {
    this.authRights.approve = this.authResolver.isAuthorized(
      'group-approveApplicationInternal_int_policy',
      [this.group],
    );
    this.authRights.reject = this.authResolver.isAuthorized(
      'group-rejectApplication_int_String_policy',
      [this.group],
    );
    this.authRights.delete = this.authResolver.isAuthorized(
      'group-deleteApplication_Application_policy',
      [this.group],
    );
    this.authRights.resend = this.authResolver.isAuthorized(
      'group-sendMessage_Application_MailType_String_policy',
      [this.group],
    );
  }
}
