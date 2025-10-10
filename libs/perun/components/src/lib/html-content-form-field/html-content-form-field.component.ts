import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TranslateModule } from '@ngx-translate/core';
import { HtmlEscapeService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'perun-web-apps-html-content-form-field',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    TextFieldModule,
    TranslateModule,
  ],
  templateUrl: './html-content-form-field.component.html',
  styleUrls: ['./html-content-form-field.component.scss'],
  providers: [HtmlEscapeService],
})
export class HtmlContentFormFieldComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) inputFormControl: FormControl<string>;
  @Input({ required: true }) tagType: 'textarea' | 'input';
  @Input() tabId: string = null;
  @Input() label = '';
  @Input() hint = '';
  @Input() minRows = 1;
  @Input() cd: ChangeDetectorRef = null;
  warningMessage = '';

  constructor(
    private htmlEscapeService: HtmlEscapeService,
    private localCd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.inputFormControl.addAsyncValidators([this.htmlEscapeService.htmlInputValidator(this.cd)]);

    // handle the warning message from validator for the case when the HTML will be changed during the sanitization
    this.htmlEscapeService.autocompletionWarning.subscribe((warning) => {
      this.warningMessage = warning;
    });
  }

  ngAfterViewInit(): void {
    this.localCd.detectChanges();
  }
}
