import { DebounceFilterComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  CabinetManagerService,
  PublicationForGUI,
  ThanksForGUI,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TABLE_PUBLICATION_THANKS } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddThanksDialogComponent } from '../../dialogs/add-thanks-dialog/add-thanks-dialog.component';
import { UniversalConfirmationItemsDialogComponent } from '@perun-web-apps/perun/dialogs';
import { BehaviorSubject } from 'rxjs';
import { ThanksListComponent } from '../thanks-list/thanks-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    TranslateModule,
    ThanksListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-add-thanks',
  templateUrl: './add-thanks.component.html',
  styleUrls: ['./add-thanks.component.scss'],
})
export class AddThanksComponent implements OnInit {
  @Input() publication: PublicationForGUI;
  @Input() selection: SelectionModel<ThanksForGUI> = new SelectionModel<ThanksForGUI>(
    true,
    [],
    true,
    (thank1, thank2) => thank1.id === thank2.id,
  );
  @Input() cachedSubject = new BehaviorSubject(true);

  @Input() similarityCheck = false;

  tableId = TABLE_PUBLICATION_THANKS;

  loading = false;
  filterValue = '';

  constructor(
    private dialog: MatDialog,
    private cabinetService: CabinetManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.cabinetService.findPublicationById(this.publication.id).subscribe((publication) => {
      this.publication = publication;
      this.selection.clear();
      this.cachedSubject.next(true);
      this.loading = false;
    });
  }

  onAddThanks(): void {
    const config = getDefaultDialogConfig();
    config.width = '800px';
    config.data = this.publication;

    const dialogRef = this.dialog.open(AddThanksDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refresh();
      }
    });
  }

  onRemoveThanks(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      items: this.selection.selected.map((thanks) => thanks.ownerName),
      title: 'PUBLICATION_DETAIL.REMOVE_THANKS_DIALOG_TITLE',
      description: 'PUBLICATION_DETAIL.REMOVE_THANKS_DIALOG_DESCRIPTION',
      theme: 'user-theme',
      type: 'remove',
      showAsk: true,
    };

    const dialogRef = this.dialog.open(UniversalConfirmationItemsDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.removeThank();
      }
    });
  }

  removeThank(): void {
    if (this.selection.selected.length === 0) {
      this.translate
        .get('PUBLICATION_DETAIL.REMOVE_THANKS_SUCCESS')
        .subscribe((success: string) => {
          this.notificator.showSuccess(success);
          this.refresh();
        });
    } else {
      this.cabinetService.deleteThanks(this.selection.selected.pop().id).subscribe(() => {
        this.removeThank();
      });
    }
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refresh();
  }
}
