import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreService } from '@perun-web-apps/perun/services';
import { Group } from '@perun-web-apps/perun/openapi';
import { GroupSearchSelectComponent } from '../group-search-select/group-search-select.component';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    GroupSearchSelectComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-create-group-form',
  templateUrl: './create-group-form.component.html',
  styleUrls: ['./create-group-form.component.css'],
})
export class CreateGroupFormComponent implements OnInit {
  @Input() parentGroup: Group = null;
  @Input() voGroups: Group[] = [];
  @Output() nameChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() descriptionChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() parentGroupChanged: EventEmitter<Group> = new EventEmitter<Group>();
  @Output() asSubgroupChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  isNotSubGroup: boolean;
  asSubgroup = false;
  invalidNameMessage: string = this.store.getProperty('group_name_error_message');
  secondaryRegex: string = this.store.getProperty('group_name_secondary_regex');
  nameControl: UntypedFormControl;
  descriptionControl: UntypedFormControl;
  selectedParent: Group;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.isNotSubGroup = this.parentGroup === null;
    this.nameControl = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(this.secondaryRegex ? this.secondaryRegex : ''),
      Validators.pattern('.*[\\S]+.*'),
    ]);
    this.descriptionControl = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(129),
    ]);
    this.selectedParent = null;
    this.voGroups = this.voGroups.filter((grp) => grp.name !== 'members');
  }

  emitName(): void {
    if (this.nameControl.invalid) {
      this.nameChanged.emit('');
    } else {
      this.nameChanged.emit(this.nameControl.value as string);
    }
  }

  emitDescription(): void {
    if (this.descriptionControl.invalid) {
      this.descriptionChanged.emit('');
    } else {
      this.descriptionChanged.emit(this.descriptionControl.value as string);
    }
  }

  emitParentGroup(parent: Group): void {
    this.selectedParent = parent;

    this.parentGroupChanged.emit(parent);
  }

  emitAsSubGroup(): void {
    if (!this.asSubgroup) {
      this.emitParentGroup(null);
    }
    this.asSubgroupChanged.emit(this.asSubgroup);
  }
}
