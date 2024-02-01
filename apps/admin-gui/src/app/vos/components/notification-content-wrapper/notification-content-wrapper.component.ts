import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HtmlEscapeService } from '@perun-web-apps/perun/services';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { UiMaterialModule } from '@perun-web-apps/ui/material';

@Component({
  selector: 'app-notification-content-wrapper',
  templateUrl: './notification-content-wrapper.component.html',
  styleUrls: ['./notification-content-wrapper.component.scss'],
  standalone: true,
  providers: [HtmlEscapeService],
  imports: [MatInputModule, NgIf, UiMaterialModule],
})
export class NotificationContentWrapperComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) inputFormControl: FormControl<string>;
  @Input({ required: true }) format: string;
  @Input({ required: true }) cd: ChangeDetectorRef = null;

  @ContentChild(MatFormFieldControl) _control: MatFormFieldControl<string>;
  @ViewChild(MatFormField) _matFormField: MatFormField;

  // Used to remove placeholder control
  beforeViewInit = true;
  warningMessage = '';

  constructor(private htmlEscapeService: HtmlEscapeService) {}

  ngOnInit(): void {
    if (this.format === 'html') {
      // set async validator to the HTML form item
      this.inputFormControl.setAsyncValidators([
        this.htmlEscapeService.htmlInputValidator(this.cd),
      ]);

      // handle the warning message from validator for the case when the HTML will be changed during the sanitization
      this.htmlEscapeService.autocompletionWarning.subscribe((warning) => {
        this.warningMessage = warning;
      });
    }
  }

  /**
   * Sorry for that a really nasty workaround, but I wasn't able to find any other working solution for the related
   * error 'mat-form-field must contain a MatFormFieldControl'
   * According to the several discussions on GitHub it looks like there is no supported solution yet for the similar
   * content projection with the <mat-form-field>, but it is requested by many people.
   * There are some links:
   *  -> https://github.com/angular/angular/issues/37319
   *  -> https://github.com/angular/components/issues/9411
   */
  ngAfterViewInit(): void {
    if (this.beforeViewInit) {
      this._matFormField._control = this._control;
      this.beforeViewInit = false;
    }
  }
}
