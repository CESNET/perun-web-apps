import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TranslateModule } from '@ngx-translate/core';
import { HtmlEscapeService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'perun-web-apps-html-textarea-form-field',
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
  templateUrl: './html-textarea-form-field.component.html',
  styleUrls: ['./html-textarea-form-field.component.scss'],
  providers: [HtmlEscapeService],
})
export class HtmlTextareaFormFieldComponent implements OnInit {
  @Input({ required: true }) inputFormControl: FormControl<string>;
  @Input() label = '';
  @Input() hint = '';
  @Input() minRows = 1;
  warningMessage = '';

  constructor(private htmlEscapeService: HtmlEscapeService) {}

  ngOnInit(): void {
    this.inputFormControl.setAsyncValidators([this.htmlEscapeService.htmlInputValidator()]);

    // handle the warning message from validator for the case when the HTML will be changed during the sanitization
    this.htmlEscapeService.autocompletionWarning.subscribe((warning) => {
      this.warningMessage = warning;
    });
  }
}
