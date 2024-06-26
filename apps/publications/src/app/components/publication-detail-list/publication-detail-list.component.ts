import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CabinetManagerService,
  Category,
  Publication,
  PublicationForGUI,
} from '@perun-web-apps/perun/openapi';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { MatDatepicker } from '@angular/material/datepicker';

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

@Component({
  selector: 'perun-web-apps-publication-detail-list',
  templateUrl: './publication-detail-list.component.html',
  styleUrls: ['./publication-detail-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
  ],
})
export class PublicationDetailListComponent implements OnInit {
  @Input() publication: PublicationForGUI;
  @Input() categories: Category[] = [];
  @Input() similarityCheck = false;
  @Output() edited: EventEmitter<boolean> = new EventEmitter<boolean>();
  loading = false;
  dataSource: MatTableDataSource<{ key; value }> = null;
  displayedColumns = ['key', 'value'];
  keys: string[];
  values: string[];
  map: { key: string; value: string }[] = [];
  yearControl: FormControl<Date>;
  categoryControl: FormControl<string>;
  rankControl: FormControl<number>;
  titleControl: FormControl<string>;
  editing = false;
  maxYear: Date;

  constructor(
    private cabinetService: CabinetManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.keys = [
      'Id / Origin',
      'Year',
      'Category',
      'Rank',
      'ISBN / ISSN',
      'DOI',
      'Full cite',
      'Created by',
      'Create date',
    ];
    this.values = [
      this.publication.id.toString(),
      this.publication.year.toString(),
      this.publication.categoryName,
      this.publication.rank.toString(),
      this.publication.isbn,
      this.publication.doi,
      this.publication.main,
      this.publication.createdBy,
      this.publication.createdDate,
    ];

    for (let i = 0; i < this.keys.length; ++i) {
      this.map.push({ key: this.keys[i], value: this.values[i] });
    }
    this.dataSource = new MatTableDataSource<{ key; value }>(this.map);

    this.titleControl = new FormControl(this.publication.title, Validators.required);
    const yearDate = new Date();
    yearDate.setFullYear(this.publication.year);
    this.yearControl = new FormControl(yearDate);
    this.categoryControl = new FormControl(this.publication.categoryName);
    this.rankControl = new FormControl(this.publication.rank, [
      Validators.pattern(/^[0-9]+(\.[0-9])?$/),
      Validators.required,
    ]);

    this.maxYear = new Date();

    this.loading = false;
  }

  save(): void {
    this.loading = true;
    this.editing = false;

    const categoryId = this.categories.find((cat) => cat.name === this.categoryControl.value).id;
    const year: number = this.yearControl.value.getFullYear();

    const updatedPublication: Publication = {
      id: this.publication.id,
      beanName: this.publication.beanName,
      externalId: this.publication.externalId,
      publicationSystemId: this.publication.publicationSystemId,
      title: this.titleControl.value,
      year: year,
      main: this.publication.main,
      isbn: this.publication.isbn,
      doi: this.publication.doi,
      categoryId: categoryId,
      rank: this.rankControl.value,
      locked: this.publication.locked,
      createdBy: this.publication.createdBy,
      createdDate: this.publication.createdDate,
    };

    this.cabinetService.updatePublication({ publication: updatedPublication }).subscribe({
      next: () => {
        this.translate
          .get('PUBLICATION_DETAIL.CHANGE_PUBLICATION_SUCCESS')
          .subscribe((success: string) => {
            this.notificator.showSuccess(success);
            this.edited.emit(true);
            this.loading = false;
          });
      },
      error: () => (this.loading = false),
    });
  }

  chosenYearHandler(normalizedYear: Date, datepicker: MatDatepicker<Date>): void {
    const ctrlValue = this.yearControl.value;
    ctrlValue.setFullYear(new Date(normalizedYear).getFullYear());
    this.yearControl.setValue(ctrlValue);
    datepicker.close();
  }
}
