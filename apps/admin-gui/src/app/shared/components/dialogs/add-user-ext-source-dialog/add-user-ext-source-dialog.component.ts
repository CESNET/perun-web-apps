import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  ExtSource,
  ExtSourcesManagerService,
  UserExtSource,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { Observable } from 'rxjs';
import { ExtSourceSearchSelectComponent } from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

interface AddUserExtSourceDialogData {
  userId: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    ExtSourceSearchSelectComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-add-user-ext-source-dialog',
  templateUrl: './add-user-ext-source-dialog.component.html',
  styleUrls: ['./add-user-ext-source-dialog.component.scss'],
})
export class AddUserExtSourceDialogComponent implements OnInit {
  filteredExtSources: Observable<ExtSource[]>;
  loginControl = new FormControl('', [Validators.required, Validators.pattern('.*[\\S]+.*')]);
  selectedExtSource: ExtSource = null;
  loading: boolean;
  extSources: ExtSource[] = [];

  private successMessage: string;

  constructor(
    private dialogRef: MatDialogRef<AddUserExtSourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddUserExtSourceDialogData,
    private extSourcesManagerService: ExtSourcesManagerService,
    private usersManagerService: UsersManagerService,
    private translate: TranslateService,
    private notificator: NotificatorService,
  ) {
    translate
      .get('DIALOGS.ADD_USER_EXT_SOURCE.SUCCESS')
      .subscribe((res: string) => (this.successMessage = res));
  }

  ngOnInit(): void {
    this.loading = true;
    this.loginControl.markAllAsTouched();
    this.extSourcesManagerService.getExtSources().subscribe({
      next: (extSources) => {
        this.extSources = extSources;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onAdd(): void {
    this.loading = true;
    const ues: UserExtSource = {
      beanName: '',
      extSource: this.selectedExtSource,
      id: 0,
      login: this.loginControl.value,
      userId: this.data.userId,
    };
    this.usersManagerService
      .addUserExtSource({ user: this.data.userId, userExtSource: ues })
      .subscribe({
        next: () => {
          this.loading = false;
          this.notificator.showSuccess(this.successMessage);
          this.dialogRef.close(true);
        },
        error: () => (this.loading = false),
      });
  }
}
