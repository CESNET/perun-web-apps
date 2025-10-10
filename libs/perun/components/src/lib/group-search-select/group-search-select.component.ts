import { TranslateModule } from '@ngx-translate/core';
import { EntitySearchSelectComponent } from '../entity-search-select/entity-search-select.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from '@perun-web-apps/perun/openapi';
import { compareFnName } from '@perun-web-apps/perun/utils';

@Component({
  imports: [CommonModule, EntitySearchSelectComponent, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-group-search-select',
  templateUrl: './group-search-select.component.html',
  styleUrls: ['./group-search-select.component.css'],
})
export class GroupSearchSelectComponent implements OnInit {
  @Input() groups: Group[];
  @Input() disableAutoSelect = false;
  @Input() firstSelectedGroup: Group;
  @Input() displayStatus = false;
  @Output() groupSelected = new EventEmitter<Group>();

  nameFunction = (group: Group): string => group.name;

  ngOnInit(): void {
    this.groups = this.groups.sort(compareFnName);
  }
}
