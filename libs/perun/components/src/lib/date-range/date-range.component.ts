import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent implements OnInit {
  @Input() startDate: FormControl<Date | string>;
  @Input() endDate: FormControl<Date | string>;
  @Input() allowFutureDate: boolean = false;
  startMinDate: Date;
  endMaxDate: Date;

  ngOnInit(): void {
    this.startMinDate = new Date(2000, 0, 1);
    this.endMaxDate = this.allowFutureDate ? new Date(3000, 0, 1) : new Date();
  }
}
