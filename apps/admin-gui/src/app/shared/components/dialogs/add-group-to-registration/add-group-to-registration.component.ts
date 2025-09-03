import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, GroupsListComponent } from '@perun-web-apps/perun/components';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Group } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { TABLE_ADD_GROUP_TO_REGISTRATION } from '@perun-web-apps/config/table-config';
import { AddGroupToVoRegistrationComponent } from '../add-group-to-vo-registration/add-group-to-vo-registration.component';
import { AddGroupToGroupRegistrationComponent } from '../add-group-to-group-registration/add-group-to-group-registration.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    DebounceFilterComponent,
    TranslateModule,
    LoaderDirective,
    GroupsListComponent,
  ],
  standalone: true,
  selector: 'app-add-group-to-registration',
  templateUrl: './add-group-to-registration.component.html',
  styleUrls: ['./add-group-to-registration.component.css'],
})
export class AddGroupToRegistrationComponent {
  @Input() loading = false;
  @Input() theme: string;
  @Input() dialogRef: MatDialogRef<
    AddGroupToVoRegistrationComponent | AddGroupToGroupRegistrationComponent
  >;
  @Input() unAssignedGroups: Group[];
  @Input() selection: SelectionModel<Group>;

  @Output() addEvent: EventEmitter<void> = new EventEmitter<void>();

  filterValue = '';
  tableId = TABLE_ADD_GROUP_TO_REGISTRATION;

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
