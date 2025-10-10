import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface CreateResourceTagDialogDialogData {
  voId: number;
  theme: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-create-resource-tag-dialog',
  templateUrl: './create-resource-tag-dialog.component.html',
  styleUrls: ['./create-resource-tag-dialog.component.scss'],
})
export class CreateResourceTagDialogComponent implements OnInit {
  name = '';
  theme: string;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<CreateResourceTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CreateResourceTagDialogDialogData,
    private resourceManager: ResourcesManagerService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.name !== '') {
      this.loading = true;
      this.resourceManager.createResourceTagWithTagName(this.name, this.data.voId).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        () => (this.loading = false),
      );
    }
  }
}
