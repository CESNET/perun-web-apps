import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Attribute } from '@perun-web-apps/perun/openapi';

export interface AttributeValueListEditDialogData {
  attribute: Attribute;
  index: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-attribute-value-list-edit-dialog',
  templateUrl: './attribute-value-list-edit-dialog.component.html',
  styleUrls: ['./attribute-value-list-edit-dialog.component.scss'],
})
export class AttributeValueListEditDialogComponent implements OnInit {
  attributeValue = '';

  constructor(
    public dialogRef: MatDialogRef<AttributeValueListEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttributeValueListEditDialogData,
  ) {}

  ngOnInit(): void {
    this.attributeValue = (this.data.attribute.value as string[])[this.data.index];
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    (this.data.attribute.value as string[])[this.data.index] = this.attributeValue;
    this.dialogRef.close(true);
  }
}
