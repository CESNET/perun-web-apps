import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CabinetManagerService, Category } from '@perun-web-apps/perun/openapi';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { formatDate } from '@angular/common';

export const YEAR_MODE_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface FilterPublication {
  title: string;
  isbnissn: string;
  doi: string;
  category: number;
  startYear: string;
  endYear: string;
}

@Component({
  selector: 'perun-web-apps-publication-filter',
  templateUrl: './publication-filter.component.html',
  styleUrls: ['./publication-filter.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
  ],
})
export class PublicationFilterComponent implements OnInit {
  @Output() filteredPublication: EventEmitter<FilterPublication> =
    new EventEmitter<FilterPublication>();
  categories: Category[];
  title = new FormControl('');
  code = new FormControl('');
  selectedMode: string;
  selectedCategory: Category | 'no_value';
  startYear: FormControl<Date> = new FormControl(new Date());
  endYear: FormControl<Date> = new FormControl(new Date());

  constructor(private cabinetService: CabinetManagerService) {}

  ngOnInit(): void {
    this.title.setValue('');
    this.code.setValue('');
    this.selectedCategory = 'no_value';
    this.cabinetService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.selectedMode = 'isbn/issn';
    });
  }

  filter(): void {
    const code = this.code.value;
    const filter = {
      title: this.title.value,
      isbnissn: this.selectedMode === 'isbn/issn' ? code : null,
      doi: this.selectedMode === 'doi' ? code : null,
      category: this.selectedCategory !== 'no_value' ? this.selectedCategory.id : null,
      startYear: formatDate(this.startYear.value ? this.startYear.value : null, 'yyyy', 'en-GB'),
      endYear: formatDate(this.endYear.value, 'yyyy', 'en-GB'),
    };
    this.filteredPublication.emit(filter);
  }

  clearFilter(): void {
    this.title.setValue('');
    this.code.setValue('');
    this.selectedMode = 'isbn/issn';
    this.selectedCategory = 'no_value';
    this.startYear.setValue(null);
    this.endYear.setValue(new Date());
    const filter = {
      title: null,
      isbnissn: null,
      doi: null,
      category: null,
      startYear: null,
      endYear: null,
    };
    this.filteredPublication.emit(filter);
  }
}
