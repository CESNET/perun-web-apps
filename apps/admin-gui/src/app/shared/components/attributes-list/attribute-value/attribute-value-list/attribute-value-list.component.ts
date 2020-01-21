import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Attribute } from '@perun-web-apps/perun/models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-attribute-value-list',
  templateUrl: './attribute-value-list.component.html',
  styleUrls: ['./attribute-value-list.component.scss']
})
export class AttributeValueListComponent implements OnInit {

  constructor() {
  }

  @Input()
  attribute: Attribute;

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Output() sendEventToParent = new EventEmitter();

  ngOnInit() {
    if (this.attribute.value === undefined) {
      this.attribute.value = [];
    }
  }

  _sendEventToParent() {
    this.sendEventToParent.emit();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const valueL = event.value;

    if ((valueL || '').trim()) {
      this.attribute.value.push(valueL.trim());
    }

    if (input) {
      input.value = '';
    }
    this.sendEventToParent.emit();
  }

  remove(chip: string): void {
    const index = this.attribute.value.indexOf(chip);

    if (index >= 0) {
      this.attribute.value.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.attribute.value, event.previousIndex, event.currentIndex);
  }
}
