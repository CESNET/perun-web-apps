import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CabinetManagerService, PublicationForGUI } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { PublicationsListComponent } from '../../components/publications-list/publications-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    PublicationsListComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'perun-web-apps-remove-publication-dialog',
  templateUrl: './remove-publication-dialog.component.html',
  styleUrls: ['./remove-publication-dialog.component.scss'],
})
export class RemovePublicationDialogComponent implements OnInit {
  publications: PublicationForGUI[];
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<RemovePublicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PublicationForGUI[],
    private notificator: NotificatorService,
    private translate: TranslateService,
    private cabinetService: CabinetManagerService,
  ) {}

  ngOnInit(): void {
    this.publications = this.data;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  remove(): void {
    this.loading = true;
    this.cabinetService.deletePublication(this.publications.pop().id).subscribe(
      () => {
        if (this.publications.length <= 0) {
          this.translate
            .get('DIALOGS.REMOVE_PUBLICATION.REMOVE_SUCCESS')
            .subscribe((successMessage: string) => {
              this.notificator.showSuccess(successMessage);
              this.dialogRef.close(true);
            });
        } else {
          this.remove();
        }
      },
      () => (this.loading = false),
    );
  }
}
