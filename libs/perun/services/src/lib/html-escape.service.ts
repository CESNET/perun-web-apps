import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { ApiRequestConfigurationService } from './api-request-configuration.service';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RPCError } from '@perun-web-apps/perun/models';

@Injectable({
  providedIn: 'root',
})
export class HtmlEscapeService {
  constructor(
    private registrarManager: RegistrarManagerService,
    private apiRequestConfiguration: ApiRequestConfigurationService,
  ) {}

  /**
   * Checkbox async validator has specific rules - only <a> elements with `href` and `target` attributes are allowed
   */
  checkboxValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      return timer(500).pipe(
        switchMap(() => {
          this.apiRequestConfiguration.dontHandleErrorForNext();
          return this.registrarManager.checkCheckboxHtml(String(control.value));
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
   * @param formGroupStatus form group status
   * @param cd changeDetectorRef to detect changes in form group
   */
  htmlInputValidator(formGroupStatus?: string, cd?: ChangeDetectorRef): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      // handle the edge case described in JSDoc
      if (formGroupStatus) {
        control.markAsPending();
        cd.detectChanges();
      }
      return timer(500).pipe(
        switchMap(() => {
          this.apiRequestConfiguration.dontHandleErrorForNext();
          return this.registrarManager.checkHtmlInput(String(control.value));
        }),
        map(() => null),
        catchError((err: RPCError) => {
          const rpcErr = err.message.substring(err.message.indexOf(':') + 1);
          return of({ invalidHtmlContent: rpcErr }) as Observable<ValidationErrors>;
        }),
      ) as Observable<ValidationErrors>;
    };
  }
}
