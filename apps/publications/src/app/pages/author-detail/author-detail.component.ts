import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CabinetManagerService,
  PublicationForGUI,
  User,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { RemovePublicationDialogComponent } from '../../dialogs/remove-publication-dialog/remove-publication-dialog.component';
import {
  FilterPublication,
  PublicationFilterComponent,
} from '../../components/publication-filter/publication-filter.component';
import { BehaviorSubject } from 'rxjs';
import { PublicationsListComponent } from '../../components/publications-list/publications-list.component';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RefreshButtonComponent,
    MatProgressSpinnerModule,
    TranslateModule,
    PublicationsListComponent,
    PublicationFilterComponent,
    UserFullNamePipe,
    LoadingTableComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'perun-web-apps-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.scss'],
})
export class AuthorDetailComponent implements OnInit {
  loading: boolean;
  initLoading: boolean;
  publications: PublicationForGUI[] = [];
  selected = new SelectionModel<PublicationForGUI>(
    true,
    [],
    true,
    (publication1, publication2) => publication1.id === publication2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  author: User;

  constructor(
    private route: ActivatedRoute,
    private cabinetService: CabinetManagerService,
    private userService: UsersManagerService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.initLoading = true;
    this.route.params.subscribe((params) => {
      const authorId = Number(params['authorId']);
      this.userService.getUserById(authorId).subscribe((user) => {
        this.author = user;
        this.initLoading = false;
        this.refreshTable();
      });
    });
  }

  removePublication(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = this.selected.selected;

    const dialogRef = this.dialog.open(RemovePublicationDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable(): void {
    this.loading = true;
    this.selected.clear();
    this.cachedSubject.next(true);
    this.cabinetService
      .findPublicationsByGUIFilter(null, null, null, null, null, null, null, null, this.author.id)
      .subscribe((publications) => {
        this.publications = publications;
        this.loading = false;
      });
  }

  filterPublication(event: FilterPublication): void {
    this.loading = true;
    this.selected.clear();
    this.cachedSubject.next(true);
    this.cabinetService
      .findPublicationsByGUIFilter(
        event.title,
        event.isbnissn,
        event.doi,
        null,
        null,
        event.category,
        +event.startYear,
        +event.endYear,
        this.author.id,
      )
      .subscribe((publications) => {
        this.publications = publications;
        this.loading = false;
      });
  }
}
