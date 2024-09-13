import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { ApiRequestConfigurationService } from './api-request-configuration.service';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RPCError } from '@perun-web-apps/perun/models';

@Injectable({
  providedIn: 'root',
})
export class HtmlEscapeService {
  autocompletionWarning: Observable<string>;
  private autocompletionMessage = new BehaviorSubject<string>('');

  constructor(
    private registrarManager: RegistrarManagerService,
    private apiRequestConfiguration: ApiRequestConfigurationService,
  ) {
    this.autocompletionWarning = this.autocompletionMessage.asObservable();
  }

  /**
   * Checkbox async validator has specific rules - only <a> elements with `href` and `target` attributes are allowed
   */
  checkboxValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      return timer(500).pipe(
        switchMap(() => {
          this.apiRequestConfiguration.dontHandleErrorForNext();
          return this.registrarManager.checkCheckboxHtml({ html: String(control.value) });
        }),
        map(() => null),
        catchError((err: RPCError) => {
          const rpcErr = err.message.substring(err.message.indexOf(':') + 1);
          return of({ invalidHtmlContent: rpcErr }) as Observable<ValidationErrors>;
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
   */
  htmlInputValidator(cd?: ChangeDetectorRef): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      // handle the edge case described in JSDoc
      if (cd) {
        control.markAsPending();
        cd.detectChanges();
      }
      return timer(500).pipe(
        switchMap(() => {
          this.apiRequestConfiguration.dontHandleErrorForNext();
          return this.registrarManager.checkHtmlInput({ html: String(control.value) });
        }),
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
      ) as Observable<ValidationErrors>;
    };
  }
}
