import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BugReportDialogComponent } from './bug-report-dialog/bug-report-dialog.component';
import { ChangeMemberStatusDialogComponent } from './change-member-status-dialog/change-member-status-dialog.component';
import { ChangeExpirationDialogComponent } from './change-expiration-dialog/change-expiration-dialog.component';
import { EditFacilityResourceGroupVoDialogComponent } from './edit-facility-resource-group-vo-dialog/edit-facility-resource-group-vo-dialog.component';
import { GroupSyncDetailDialogComponent } from './group-sync-detail-dialog/group-sync-detail-dialog.component';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';
import { RemoveUserExtSourceDialogComponent } from './remove-user-ext-source-dialog/remove-user-ext-source-dialog.component';
import { ShowValueDialogComponent } from './show-value-dialog/show-value-dialog.component';
import { EditAttributeDialogComponent } from './edit-attribute-dialog/edit-attribute-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AttributeValueListEditDialogComponent } from './attribute-value-list-edit-dialog/attribute-value-list-edit-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { PerunPipesModule } from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { AttributeValueListDeleteDialogComponent} from './attribute-value-list-delete-dialog/attribute-value-list-delete-dialog.component';
import { ChangeEmailDialogComponent } from './change-email-dialog/change-email-dialog.component';
import { UniversalRemoveItemsDialogComponent } from './universal-remove-items-dialog/universal-remove-items-dialog.component';
import { MemberTreeViewDialogComponent } from './member-tree-view-dialog/member-tree-view-dialog.component';
import { RouterModule } from '@angular/router';
import { MatTreeModule } from '@angular/material/tree';
import { MailChangeFailedDialogComponent } from './mail-change-failed-dialog/mail-change-failed-dialog.component';
import { UniversalConfirmationDialogComponent } from './universal-confirmation-dialog/universal-confirmation-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { ChangeGroupExpirationDialogComponent } from './change-group-expiration-dialog/change-group-expiration-dialog.component';
import { ChangeVoExpirationDialogComponent } from './change-vo-expiration-dialog/change-vo-expiration-dialog.component';
import { ChangeSponsorshipExpirationDialogComponent } from './change-sponsorship-expiration-dialog/change-sponsorship-expiration-dialog.component';
import { ChangeGroupResourceAssigmentDialogComponent } from './change-group-resource-assigment-dialog/change-group-resource-assigment-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    ClipboardModule,
    MatIconModule,
    PerunPipesModule,
    UiAlertsModule,
    RouterModule,
    MatTreeModule,
    MatSelectModule
  ],
  declarations: [
    BugReportDialogComponent,
    ChangeExpirationDialogComponent,
    ChangeMemberStatusDialogComponent,
    EditFacilityResourceGroupVoDialogComponent,
    GroupSyncDetailDialogComponent,
    NotificationDialogComponent,
    RemoveUserExtSourceDialogComponent,
    ShowValueDialogComponent,
    EditAttributeDialogComponent,
    AttributeValueListEditDialogComponent,
    AttributeValueListDeleteDialogComponent,
    ChangeEmailDialogComponent,
    UniversalRemoveItemsDialogComponent,
    MemberTreeViewDialogComponent,
    MailChangeFailedDialogComponent,
    UniversalConfirmationDialogComponent,
    ChangeGroupExpirationDialogComponent,
    ChangeVoExpirationDialogComponent,
    ChangeSponsorshipExpirationDialogComponent,
    ChangeGroupResourceAssigmentDialogComponent
  ],
  exports: [
    ChangeExpirationDialogComponent,
    ChangeMemberStatusDialogComponent,
    EditFacilityResourceGroupVoDialogComponent,
    GroupSyncDetailDialogComponent,
    NotificationDialogComponent,
    RemoveUserExtSourceDialogComponent,
    ShowValueDialogComponent,
    EditAttributeDialogComponent,
    AttributeValueListEditDialogComponent,
    AttributeValueListDeleteDialogComponent,
    ChangeEmailDialogComponent,
    UniversalRemoveItemsDialogComponent,
    MemberTreeViewDialogComponent,
    MailChangeFailedDialogComponent,
    ChangeGroupExpirationDialogComponent,
    ChangeVoExpirationDialogComponent
  ]
})
export class PerunDialogsModule {
}
