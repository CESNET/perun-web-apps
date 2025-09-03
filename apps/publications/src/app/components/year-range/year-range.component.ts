import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-year-range',
  templateUrl: './year-range.component.html',
  styleUrls: ['./year-range.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class YearRangeComponent implements OnInit {
  @Input() startYear: FormControl<Date>;
  @Input() endYear: FormControl<Date>;
  startMaxYear: Date;
  endMinYear: Date;
  endMaxYear: Date;

  ngOnInit(): void {
    this.endMaxYear = new Date();
    this.startMaxYear = this.endYear.value;
    this.startYear.setValue(null);
  }

  chosenYearHandler(
    dateFormControl: FormControl<Date>,
    event: Date,
    datepicker: MatDatepicker<Date>,
  ): void {
    dateFormControl.setValue(event);
    this.startMaxYear = this.endYear.value;
    this.endMinYear = this.startYear.value ? this.startYear.value : null;
    datepicker.close();
  }
}
