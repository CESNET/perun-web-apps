import { Injectable } from '@angular/core';
import { HttpContextToken } from '@angular/common/http';

export const SKIP_ERROR_NOTIFICATION = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
export class ApiRequestConfigurationService {
  private handleNextError = true;

  dontHandleErrorForNext(): void {
    this.handleNextError = false;
  }

  shouldHandleError(): boolean {
    const value: boolean = this.handleNextError;
    this.handleNextError = true;
    return value;
  }
}
