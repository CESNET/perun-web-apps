import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Attribute } from '@perun-web-apps/perun/openapi';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'perun-web-apps-attribute-value-list',
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
      // @ts-ignore
      this.attribute.value.push(valueL.trim());
    }

    if (input) {
      input.value = '';
    }
    this.sendEventToParent.emit();
  }

  remove(chip: string): void {
    // @ts-ignore
    const index = this.attribute.value.indexOf(chip);

    if (index >= 0) {
      // @ts-ignore
      this.attribute.value.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    // @ts-ignore
    moveItemInArray(this.attribute.value, event.previousIndex, event.currentIndex);
  }
}
