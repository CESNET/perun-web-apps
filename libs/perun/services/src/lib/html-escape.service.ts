import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { ApiRequestConfigurationService } from './api-request-configuration.service';
import { BehaviorSubject, iif, Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RPCError } from '@perun-web-apps/perun/models';
import { HtmlParsingResult, UtilityMethodsService } from '@perun-web-apps/perun/registrar-openapi';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class HtmlEscapeService {
  autocompletionWarning: Observable<string>;
  private autocompletionMessage = new BehaviorSubject<string>('');
  private warningMessage: string = this.translateService.instant(
    'DIALOGS.APPLICATION_FORM_EDIT_ITEM.HTML_ERROR.WARNING',
  ) as string;
  private checkboxWarningMessage: string = this.translateService.instant(
    'DIALOGS.APPLICATION_FORM_EDIT_ITEM.HTML_ERROR.CHECKBOX',
  ) as string;

  constructor(
    private registrarManager: RegistrarManagerService,
    private utilsService: UtilityMethodsService,
    private apiRequestConfiguration: ApiRequestConfigurationService,
    private translateService: TranslateService,
  ) {
    this.autocompletionWarning = this.autocompletionMessage.asObservable();
  }

  /**
   * Checkbox async validator has specific rules - only <a> elements with `href` and `target` attributes are allowed
   */
  checkboxValidator(useNewRegistrar = false): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      return timer(500).pipe(
        switchMap(() => {
          this.apiRequestConfiguration.dontHandleErrorForNext();
          return iif(
            () => useNewRegistrar,
            this.utilsService.checkCheckboxHtml(String(control.value)).pipe(
              map((valid) =>
                valid
                  ? null
                  : {
                      invalidHtmlContent: this.checkboxWarningMessage,
                    },
              ),
            ),
            this.registrarManager.checkHtmlInput({ html: String(control.value) }).pipe(
              map(() => null),
              catchError((err: RPCError) => {
                const rpcErr = err.message.substring(err.message.indexOf(':') + 1);
                return of({ invalidHtmlContent: rpcErr }) as Observable<ValidationErrors>;
              }),
            ),
          );
        }),
      ) as Observable<ValidationErrors>;
    };
  }

  /**
   * Generic async html validator
   *
   * Use these parameters only for the edge case when the form group is revalidated on each tab change
   * e.g. in it AddEditNotificationDialogComponent it caused ExpressionChangedAfterItHasBeenCheckedError on 'ng-valid' property
   * @param cd changeDetectorRef to detect changes in form group
   * @param useNewRegistrar use new registrar API
   */
  htmlInputValidator(cd?: ChangeDetectorRef, useNewRegistrar = false): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      // handle the edge case described in JSDoc
      if (cd) {
        control.markAsPending();
        cd.detectChanges();
      }
      return timer(500).pipe(
        switchMap(() => {
          this.apiRequestConfiguration.dontHandleErrorForNext();
          return iif(
            () => useNewRegistrar,
            this.utilsService
              .checkHtml(String(control.value))
              .pipe(
                map((htmlResult) =>
                  htmlResult.valid
                    ? this.htmlResultToWarning(htmlResult, control.value as string)
                    : this.htmlResultToErrorString(htmlResult),
                ),
              ),
            this.registrarManager.checkHtmlInput({ html: String(control.value) }).pipe(
              map((warningMessage) => {
                if (this.autocompletionMessage.value !== warningMessage) {
                  this.autocompletionMessage.next(warningMessage);
                }
                return null;
              }),
              catchError((err: RPCError) => {
                const rpcErr = err.message.substring(err.message.indexOf(':') + 1);
                return of({ invalidHtmlContent: rpcErr }) as Observable<ValidationErrors>;
              }),
            ),
          );
        }),
      ) as Observable<ValidationErrors>;
    };
  }

  private htmlResultToWarning(htmlResult: HtmlParsingResult, value: string): void {
    if (value === '') return null;
    if (
      htmlResult.escapedHTML !== value &&
      this.autocompletionMessage.value !== this.warningMessage
    ) {
      this.autocompletionMessage.next(this.warningMessage);
    } else {
      this.autocompletionMessage.next('');
    }
    return null;
  }

  private htmlResultToErrorString(htmlResult: HtmlParsingResult): ValidationErrors {
    let result = '';
    if (htmlResult.escapedTags.length > 0) {
      result +=
        this.translateService.instant('DIALOGS.APPLICATION_FORM_EDIT_ITEM.HTML_ERROR.TAGS') +
        htmlResult.escapedTags.join(', ') +
        ' .';
    }
    if (htmlResult.escapedAttributes.length > 0) {
      result +=
        this.translateService.instant('DIALOGS.APPLICATION_FORM_EDIT_ITEM.HTML_ERROR.ATTRIBUTES') +
        htmlResult.escapedAttributes.join(', ') +
        ' .';
    }
    if (htmlResult.escapedStyles.length > 0) {
      result +=
        this.translateService.instant('DIALOGS.APPLICATION_FORM_EDIT_ITEM.HTML_ERROR.STYLES') +
        htmlResult.escapedStyles.join(', ') +
        ' .';
    }
    if (htmlResult.escapedLinks.length > 0) {
      result += this.translateService.instant(
        'DIALOGS.APPLICATION_FORM_EDIT_ITEM.HTML_ERROR.LINKS',
        { links: htmlResult.escapedLinks.join(', ') },
      );
    }
    return { invalidHtmlContent: result };
  }
}
