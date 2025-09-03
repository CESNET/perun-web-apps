import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Attribute } from '@perun-web-apps/perun/openapi';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AttributeValueListEditDialogComponent } from '@perun-web-apps/perun/dialogs';
import { AttributeValueListDeleteDialogComponent } from '@perun-web-apps/perun/dialogs';
import { getDefaultDialogConfig, isVirtualAttribute } from '@perun-web-apps/perun/utils';
import { ShowValueDialogComponent } from '@perun-web-apps/perun/dialogs';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatTooltip,
    MatChipsModule,
    CdkDropList,
    CdkDrag,
  ],
  standalone: true,
  selector: 'perun-web-apps-attribute-value-list',
  templateUrl: './attribute-value-list.component.html',
  styleUrls: ['./attribute-value-list.component.scss'],
})
export class AttributeValueListComponent implements OnInit {
  @Input() attribute: Attribute;
  @Input() readonly = false;
  @Output() sendEventToParent = new EventEmitter();

  selectable = false;
  removable = true;
  addOnBlur = true;
  dragDisabled = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  values: string[] = [];

  showMore = false;
  defaultItemsShown = 5;
  itemsShown: number;

  constructor(
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.removable = !isVirtualAttribute(this.attribute) && !this.readonly;
    if (this.attribute.value === undefined || this.attribute.value === null) {
      this.attribute.value = [];
    }
    this.values = this.attribute.value as string[];
    this.itemsShown = this.readonly ? this.values.length : this.defaultItemsShown;
    this.showMore = this.readonly;
    if (!this.readonly) {
      this.readonly = isVirtualAttribute(this.attribute);
    }
  }

  _sendEventToParent(): void {
    this.sendEventToParent.emit();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const valueL = event.value;

    if ((valueL || '').trim()) {
      (this.attribute.value as string[]).push(valueL.trim());
      this.values = this.attribute.value as string[];
      if (this.values.length > this.defaultItemsShown) {
        this.showMore = true;
        this.setItemsShown();
      }
    }

    if (input) {
      input.value = '';
    }
    this.sendEventToParent.emit();
  }

  remove(chip: string): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = { name: chip };

    const dialogRef = this.dialog.open(AttributeValueListDeleteDialogComponent, config);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        const index = (this.attribute.value as string[]).indexOf(chip);
        (this.attribute.value as string[]).splice(index, 1);
        this.values = this.attribute.value as string[];
        this.sendEventToParent.emit();
        this.changeDetector.detectChanges();
      }
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    this.dragDisabled = true;
    moveItemInArray(this.attribute.value as string[], event.previousIndex, event.currentIndex);
    this.values = this.attribute.value as string[];
  }

  edit(chip: string): void {
    const index: number = (this.attribute.value as string[]).indexOf(chip);

    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = { attribute: this.attribute, index: index };

    const dialogRef = this.dialog.open(AttributeValueListEditDialogComponent, config);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.values = this.attribute.value as string[];
        this.sendEventToParent.emit();
      }
    });
  }

  showValue(value: string, title: string): void {
    const config = getDefaultDialogConfig();
    config.width = '350px';
    config.data = {
      value: value,
      title: title,
    };
    this.dialog.open(ShowValueDialogComponent, config);
  }

  setItemsShown(): void {
    if (this.showMore) {
      this.itemsShown = this.values.length;
    } else {
      this.itemsShown = this.defaultItemsShown;
    }
  }

  onShowChange(): void {
    this.showMore = !this.showMore;

    this.setItemsShown();
  }
}
