import { TranslateModule } from '@ngx-translate/core';
import { ExpirationSelectComponent } from '../expiration-select/expiration-select.component';
import { ParseDatePipe } from '@perun-web-apps/perun/pipes';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ParseDatePipe,
    ExpirationSelectComponent,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-change-expiration-dialog',
  templateUrl: './change-expiration-dialog.component.html',
  styleUrls: ['./change-expiration-dialog.component.scss'],
})
export class ChangeExpirationDialogComponent implements OnInit {
  @Input() status: string;
  @Input() currentExpiration: string;
  @Input() canExtendInVo = false;
  @Input() canExtendInGroup = false;
  @Input() loading = false;
  @Input() theme = 'vo-theme';
  @Output() expirationChanged: EventEmitter<string> = new EventEmitter<string>();

  newExpiration: string;
  minDate: Date;
  maxDate: Date;

  constructor(private dialogRef: MatDialogRef<ChangeExpirationDialogComponent>) {}

  ngOnInit(): void {
    this.setDateBounds();
  }

  onChangeExpiration(): void {
    this.expirationChanged.emit(this.newExpiration ? this.newExpiration : this.currentExpiration);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  setExpiration(newExp: string): void {
    this.newExpiration = newExp;
  }

  private setDateBounds(): void {
    if (this.status === 'VALID') {
      this.minDate = new Date();
      this.maxDate = null;
    } else if (this.status === 'EXPIRED') {
      this.minDate = null;
      this.maxDate = new Date();
    } else {
      // Change expiration of sponsorship
      this.minDate = new Date();
    }
  }
}
