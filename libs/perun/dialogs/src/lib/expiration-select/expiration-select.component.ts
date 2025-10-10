import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { formatDate, CommonModule } from '@angular/common';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    FormsModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-expiration-select',
  templateUrl: './expiration-select.component.html',
  styleUrls: ['./expiration-select.component.css'],
})
export class ExpirationSelectComponent implements OnInit, OnChanges {
  @Input() expiration = 'never';
  @Input() allowNever = true;
  @Input() canExtendInVo = false;
  @Input() canExtendInGroup = false;
  @Input() minDate: Date = null;
  @Input() maxDate: Date = null;
  @Input() newStatus: string;
  @Input() theme = 'vo-theme';
  @Output() expirationSelected: EventEmitter<string> = new EventEmitter<string>();
  expirationControl = new FormControl<string>(null);
  showGroupRules = false;
  showVoRules = false;

  ngOnInit(): void {
    // Set preselected value
    let expDate: Date = null;
    // Current expiration value, if not "never", has the highest priority
    if (this.expiration !== 'never') {
      expDate = new Date(this.expiration);
    }
    // Select one of the bounds as a suggestion if expiration is "never"
    const defExp = this.maxDate ? this.maxDate : this.minDate;
    expDate = expDate ? expDate : defExp;
    // Assume at least one of the candidate values was set
    this.expirationControl.setValue(this.parseDate(expDate));
    if (this.theme === 'vo-theme') {
      this.showVoRules =
        (this.canExtendInVo && (this.newStatus === undefined || this.newStatus === null)) ||
        this.newStatus === 'VALID';
    }
    if (this.theme === 'group-theme') {
      this.showGroupRules =
        (this.canExtendInGroup && (this.newStatus === undefined || this.newStatus === null)) ||
        this.newStatus === 'VALID';
    }
  }

  ngOnChanges(): void {
    // Change selected date to be in [min, max] range in case one of the bounds changes
    const selectedExpiration = new Date(this.expirationControl.value);
    let validExpiration = selectedExpiration;
    if (this.minDate && selectedExpiration < this.minDate) {
      validExpiration = this.minDate;
    } else if (this.maxDate && selectedExpiration > this.maxDate) {
      validExpiration = this.maxDate;
    }

    this.expirationControl.setValue(this.parseDate(validExpiration));
  }

  setExpiration(exp: MatDatepickerInputEvent<Date>): void {
    this.expiration = this.parseDate(exp.value);
    this.expirationControl.setValue(this.expiration);

    this.emitDate();
  }

  emitDate(): void {
    // Emitted date has correct format, and the value is always valid
    this.expirationSelected.emit(this.expiration);
  }

  private parseDate(d: Date): string {
    return formatDate(d, 'yyyy-MM-dd', 'en-GB');
  }
}
