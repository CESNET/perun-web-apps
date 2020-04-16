import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Attribute } from '@perun-web-apps/perun/openapi';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AttributeValueListEditDialogComponent } from './attribute-value-list-edit-dialog/attribute-value-list-edit-dialog.component';
import { AttributeValueListDeleteDialogComponent } from './attribute-value-list-delete-dialog/attribute-value-list-delete-dialog.component';
import { IsVirtualAttributePipe } from '@perun-web-apps/perun/pipes';

@Component({
  selector: 'perun-web-apps-attribute-value-list',
  templateUrl: './attribute-value-list.component.html',
  styleUrls: ['./attribute-value-list.component.scss']
})
export class AttributeValueListComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  @Input()
  attribute: Attribute;

  selectable = false;
  removable = true;
  addOnBlur = true;
  dragDisabled = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Output() sendEventToParent = new EventEmitter();

  ngOnInit() {
    this.removable = ! new IsVirtualAttributePipe().transform(this.attribute);
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
    const dialogRef = this.dialog.open(AttributeValueListDeleteDialogComponent, {
      width: '400px',
      data: { name: chip }
    });
    dialogRef.afterClosed().subscribe( (success) => {
      if (success) {
        //@ts-ignore
        const index = this.attribute.value.indexOf(chip);
        // @ts-ignore
        this.attribute.value.splice(index, 1);
        this.sendEventToParent.emit();
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    this.dragDisabled = true;
    // @ts-ignore
    moveItemInArray(this.attribute.value, event.previousIndex, event.currentIndex);
  }

  edit(chip: string) {
    // @ts-ignore
    const index = this.attribute.value.indexOf(chip);
    const dialogRef = this.dialog.open(AttributeValueListEditDialogComponent, {
      width: '600px',
      data: { attribute: this.attribute, index: index }
    });
    dialogRef.afterClosed().subscribe( (success) => {
      if (success) {
        this.sendEventToParent.emit();
      }
    });
  }
}
