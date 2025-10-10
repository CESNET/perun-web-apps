import { TranslateModule } from '@ngx-translate/core';
import { EntitySearchSelectComponent } from '../entity-search-select/entity-search-select.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@perun-web-apps/perun/openapi';
import { compareFnUser, parseFullName } from '@perun-web-apps/perun/utils';

@Component({
  imports: [CommonModule, EntitySearchSelectComponent, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-user-search-select',
  templateUrl: './user-search-select.component.html',
  styleUrls: ['./user-search-select.component.css'],
})
export class UserSearchSelectComponent implements OnInit {
  @Input() users: User[];
  @Input() disableAutoSelect = false;
  @Output() userSelected = new EventEmitter<User>();
  userFullNameFunction = parseFullName;
  ngOnInit(): void {
    this.users = this.users.sort(compareFnUser);
  }
}
