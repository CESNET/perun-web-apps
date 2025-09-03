import { TranslateModule } from '@ngx-translate/core';
import { EntitySearchSelectComponent } from '../entity-search-select/entity-search-select.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RichMember } from '@perun-web-apps/perun/openapi';
import { compareFnUser, parseFullName } from '@perun-web-apps/perun/utils';

@Component({
  imports: [CommonModule, EntitySearchSelectComponent, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-member-search-select',
  templateUrl: './member-search-select.component.html',
  styleUrls: ['./member-search-select.component.css'],
})
export class MemberSearchSelectComponent implements OnInit {
  @Input() members: RichMember[];
  @Output() memberSelected = new EventEmitter<RichMember>();
  memberFullNameFunction = (member: RichMember): string => parseFullName(member.user);

  ngOnInit(): void {
    this.members = this.members.sort(compareFnUser);
  }
}
