import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { GroupFlatNode } from '@perun-web-apps/perun/models';

@Component({
  selector: 'perun-web-apps-group-menu',
  templateUrl: './group-menu.component.html',
  styleUrls: ['./group-menu.component.scss']
})
export class GroupMenuComponent implements OnInit {

  constructor() { }

  @Input() group: GroupFlatNode;

  @Input() disabled = false;

  @Output() moveGroup: EventEmitter<void> = new EventEmitter<void>();

  @Output() whenClosed: EventEmitter<boolean> = new EventEmitter<boolean>()

  ngOnInit() {
  }

  onMoveGroup() {
    console.log('Emit menu - ' + this.group);
    this.moveGroup.emit();
  }
}
