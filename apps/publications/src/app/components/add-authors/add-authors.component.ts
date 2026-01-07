import { DebounceFilterComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddAuthorsDialogComponent } from '../../dialogs/add-authors-dialog/add-authors-dialog.component';
import { UniversalConfirmationItemsDialogComponent } from '@perun-web-apps/perun/dialogs';
import { Author, CabinetManagerService, PublicationForGUI } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { AuthorsListComponent } from '../authors-list/authors-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    TranslateModule,
    AuthorsListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-add-authors',
  templateUrl: './add-authors.component.html',
  styleUrls: ['./add-authors.component.scss'],
})
export class AddAuthorsComponent implements OnInit {
  @Input() publication: PublicationForGUI;
  @Input() selection = new SelectionModel<Author>(
    true,
    [],
    true,
    (author1, author2) => author1.id === author2.id,
  );
  @Input() cachedSubject = new BehaviorSubject(true);
  @Input() disableRouting = false;
  @Input() similarityCheck = false;
  @Output() yourselfAsAnAuthor: EventEmitter<boolean> = new EventEmitter<boolean>();

  filterValue = '';
  loading = false;

  constructor(
    private dialog: MatDialog,
    private cabinetService: CabinetManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.cabinetService.findAuthorsByPublicationId(this.publication.id).subscribe((authors) => {
      this.yourselfAsAnAuthor.emit(
        authors.some((author) => author.id === this.storeService.getPerunPrincipal().userId),
      );
      this.publication.authors = authors;
      this.selection.clear();
      this.cachedSubject.next(true);
      this.loading = false;
    });
  }

  onAddAuthors(): void {
    const config = getDefaultDialogConfig();
    config.width = '800px';
    config.data = {
      publicationId: this.publication.id,
      alreadyAddedAuthors: this.publication.authors,
    };

    const dialogRef = this.dialog.open(AddAuthorsDialogComponent, config);

    dialogRef.afterClosed().subscribe((authorshipCreated) => {
      if (authorshipCreated) {
        this.refresh();
      }
    });
  }

  onRemoveAuthors(): void {
    const config = getDefaultDialogConfig();
    config.width = '800px';
    config.data = {
      items: this.selection.selected.map(
        (author) =>
          `${author.titleBefore ? author.titleBefore : ''} ${
            author.firstName ? author.firstName : ''
          }  ${author.lastName ? author.lastName : ''} ${
            author.titleAfter ? author.titleAfter : ''
          }`,
      ),
      title: 'DIALOGS.REMOVE_AUTHORS.TITLE',
      description: 'DIALOGS.REMOVE_AUTHORS.DESCRIPTION',
      theme: 'user-theme',
      type: 'remove',
      showAsk: true,
    };

    const dialogRef = this.dialog.open(UniversalConfirmationItemsDialogComponent, config);

    dialogRef.afterClosed().subscribe((authorshipRemoved) => {
      if (authorshipRemoved) {
        this.removeAuthors(this.selection.selected);
      }
    });
  }

  removeAuthors(authorsToRemove: Author[]): void {
    this.loading = true;
    if (authorsToRemove.length) {
      const author = authorsToRemove.pop();
      this.cabinetService.deleteAuthorship(this.publication.id, author.id).subscribe(
        () => {
          this.removeAuthors(authorsToRemove);
        },
        () => (this.loading = false),
      );
    } else {
      this.notificator.showSuccess(
        this.translate.instant('DIALOGS.REMOVE_AUTHORS.SUCCESS_MESSAGE') as string,
      );
      this.refresh();
    }
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refresh();
  }
}
