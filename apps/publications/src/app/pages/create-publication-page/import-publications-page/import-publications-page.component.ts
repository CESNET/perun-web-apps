import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  CabinetManagerService,
  InputCreatePublication,
  Publication,
  PublicationForGUI,
  PublicationSystem,
} from '@perun-web-apps/perun/openapi';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { UniversalConfirmationDialogComponent } from '@perun-web-apps/perun/dialogs';
import { BehaviorSubject } from 'rxjs';
import { PublicationsListComponent } from '../../../components/publications-list/publications-list.component';
import { PublicationDetailComponent } from '../../publication-detail/publication-detail.component';
import { YearRangeComponent } from '../../../components/year-range/year-range.component';

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
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    UiAlertsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip,
    PublicationsListComponent,
    PublicationDetailComponent,
    YearRangeComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-import-publications-page',
  templateUrl: './import-publications-page.component.html',
  styleUrls: ['./import-publications-page.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
  ],
})
export class ImportPublicationsPageComponent implements OnInit {
  loading = false;
  publicationSystems: PublicationSystem[] = [];
  pubSystem: FormControl<PublicationSystem>;
  pubSystemNamespace: string;
  publications: PublicationForGUI[] = [];

  selected = new SelectionModel<PublicationForGUI>(
    true,
    [],
    true,
    (publication1, publication2) =>
      publication1.externalId === publication2.externalId &&
      publication1.publicationSystemId === publication2.publicationSystemId,
  );
  cachedSubject = new BehaviorSubject(true);
  displayedColumns = ['select', 'title', 'reportedBy', 'year', 'isbn', 'cite'];
  firstSearchDone: boolean;

  startYear: FormControl<Date>;
  endYear: FormControl<Date>;

  userId: number;
  userAsAuthor = true;

  importedPublications: Publication[] = [];
  importDone = false;
  indexExpanded: number;
  completePublications: number[] = [];

  constructor(
    private cabinetService: CabinetManagerService,
    private storeService: StoreService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.firstSearchDone = false;
    this.userId = this.storeService.getPerunPrincipal().user.id;

    const yearMinusOne = new Date();
    yearMinusOne.setFullYear(new Date().getFullYear() - 1);
    this.startYear = new FormControl(yearMinusOne);
    this.endYear = new FormControl(new Date());

    this.cabinetService.getPublicationSystems().subscribe((publicationSystems) => {
      this.publicationSystems = publicationSystems.filter((ps) => ps.friendlyName !== 'INTERNAL');
      this.pubSystem = new FormControl<PublicationSystem>(this.publicationSystems[0]);
      this.pubSystemNamespace = this.pubSystem.value.loginNamespace;
      this.loading = false;
    });
  }

  selectPubSystem(): void {
    this.pubSystemNamespace = this.pubSystem.value.loginNamespace;
  }

  searchPublications(): void {
    this.loading = true;
    this.firstSearchDone = true;

    this.cabinetService
      .findExternalPublications(
        this.storeService.getPerunPrincipal().user.id,
        new Date(this.startYear.value).getFullYear(),
        new Date(this.endYear.value).getFullYear(),
        this.pubSystemNamespace,
      )
      .subscribe({
        next: (publications) => {
          this.publications = publications;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  importPublications(publications: PublicationForGUI[]): void {
    this.loading = true;
    if (publications.length === 0) {
      this.notificator.showSuccess(this.translate.instant('IMPORT_PUBLICATIONS.SUCCESS') as string);
      this.importDone = true;
      this.indexExpanded = 0;
      this.loading = false;
      return;
    }
    const publication = publications.shift();
    const publicationInput: InputCreatePublication = {
      publication,
    };

    this.cabinetService.createPublication(publicationInput).subscribe({
      next: (pub) => {
        if (this.userAsAuthor) {
          this.cabinetService
            .createAutorship({
              authorship: {
                id: 0,
                beanName: 'Authorship',
                publicationId: pub.id,
                userId: this.userId,
              },
            })
            .subscribe({
              next: () => {
                this.importedPublications.push(pub);
                this.importPublications(publications);
              },
              error: () => (this.loading = false),
            });
        } else {
          this.importedPublications.push(pub);
          this.importPublications(publications);
        }
      },
      error: () => (this.loading = false),
    });
  }

  editPublication(index: number): void {
    this.indexExpanded = index === this.indexExpanded ? -1 : index;
  }

  completePublication(publicationId: number, indexExpanded: number): void {
    if (!this.completePublications.includes(publicationId)) {
      this.completePublications.push(publicationId);
    }
    if (indexExpanded !== this.importedPublications.length - 1) {
      this.indexExpanded = indexExpanded + 1;
    } else {
      this.indexExpanded = -1;
    }
  }

  incompletePublication(publicationId: number): void {
    if (this.completePublications.includes(publicationId)) {
      this.completePublications = this.completePublications.filter(
        (pubId) => pubId !== publicationId,
      );
    }
    this.indexExpanded = -1;
  }

  completeAllPublications(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      theme: 'user-theme',
      message: this.translate.instant('IMPORT_PUBLICATIONS.CHECK_ALL_MESSAGE') as string,
    };

    const dialogRef = this.dialog.open(UniversalConfirmationDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmit();
      }
    });
  }

  onSubmit(): void {
    this.notificator.showSuccess(
      this.translate.instant('IMPORT_PUBLICATIONS.SHOW_FINISH') as string,
    );
    void this.router.navigate(['/my-publications'], { queryParamsHandling: 'preserve' });
  }
}
