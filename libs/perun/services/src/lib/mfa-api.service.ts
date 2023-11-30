/* eslint-disable
   @typescript-eslint/no-explicit-any,
   @typescript-eslint/explicit-module-boundary-types,
   @typescript-eslint/no-unsafe-member-access,
   @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StoreService } from './store.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { from, Observable, throwError } from 'rxjs';
import { MfaSettings } from '@perun-web-apps/perun/models';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { MfaHandlerService } from './mfa-handler.service';
import { catchError, switchMap } from 'rxjs/operators';
import { now } from 'moment-timezone';
import { PerunTranslateService } from './perun-translate.service';

@Injectable({
  providedIn: 'root',
})
export class MfaApiService {
  mfaApiUrl = this.store.getProperty('mfa').api_url;
  mfaAuthValidity = this.store.getProperty('mfa').auth_validity;
  settingsBody: string;
  cachedSettings: MfaSettings;

  constructor(
    private store: StoreService,
    private oauthService: OAuthService,
    private httpClient: HttpClient,
    private attributesManagerService: AttributesManagerService,
    private mfaHandlerService: MfaHandlerService,
    private translate: PerunTranslateService,
  ) {}

  getCachedSettings(): MfaSettings {
    return this.cachedSettings;
  }

  clearCachedSettings(): void {
    this.cachedSettings = undefined;
  }

  /**
   * Checks if MFA is available for current user (if user has any MFA token)
   */
  isMfaAvailable(): Observable<boolean> {
    return this.httpClient.get<boolean>(this.mfaApiUrl + 'mfaAvailable', {
      headers: { Authorization: 'Bearer ' + this.oauthService.getAccessToken() },
    });
  }

  /**
   * This method loads the available categories and their labels from
   * the mfaCategories attribute and then loads current categories/rps settings
   * There are three types of settings responses, which you can get from mfa api:
   *    - If all categories and all services (rps) requires mfa
   *        -> { "all": true }
   *    - If no category (it means also no rps) require mfa
   *        -> []
   *    - Some categories/services (rps) require mfa
   *        -> {"include_categories": ["category1"]}
   *        -> {"include_categories": ["category1"], "exclude_rps": ["rps1"]}
   */
  getSettings(): Observable<MfaSettings> {
    const result: MfaSettings = {
      allEnforced: false,
      categories: {},
      includedCategories: [],
      excludedRps: [],
      includedRpsByCategory: new Map(),
      rpsByCategory: new Map(),
    };
    return new Observable<MfaSettings>((res) => {
      const categoriesKey = this.store.getProperty('mfa').mfa_instance;
      this.attributesManagerService
        .getEntitylessAttributeByName(
          categoriesKey,
          'urn:perun:entityless:attribute-def:def:mfaCategories',
        )
        .subscribe({
          next: (categories) => {
            const skipCategories = categories.value == null; // Checks also for undefined and null
            if (!skipCategories) {
              result.categories = JSON.parse(String(categories.value));
              for (const category in result.categories) {
                result.rpsByCategory[category] = result.categories[category].rps;
              }
            }
            this.httpClient
              .get<any>(this.mfaApiUrl + 'settings', {
                headers: { Authorization: 'Bearer ' + this.oauthService.getAccessToken() },
              })
              .subscribe({
                next: (settings) => {
                  if (settings.length !== 0) {
                    if (settings.all) {
                      result.allEnforced = settings.all;
                      result.includedCategories = Object.keys(result.categories);
                      for (const category in result.categories) {
                        result.includedRpsByCategory[category] = Object.keys(
                          result.categories[category].rps as object,
                        );
                      }
                    } else {
                      result.includedCategories = settings['include_categories']
                        ? settings['include_categories']
                        : [];
                      result.excludedRps = settings['exclude_rps'] ? settings['exclude_rps'] : [];
                      for (const category in result.categories) {
                        const includedRpsList = [];
                        if (result.includedCategories.includes(category)) {
                          // only makes sense to get rps for included categories
                          for (const rps in result.categories[category].rps) {
                            if (!result.excludedRps.includes(rps)) {
                              includedRpsList.push(rps);
                            }
                          }
                        }
                        result.includedRpsByCategory[category] = includedRpsList;
                      }
                    }
                  }
                  res.next(result);
                },
                error: (err) => {
                  console.error(err);
                  res.error(err);
                },
              });
          },
          error: (err) => {
            res.error(err);
          },
        });
    });
  }

  /**
   * This method creates request body for new settings according to toggles
   */
  saveDetailSettings(settings: MfaSettings): void {
    this.cachedSettings = settings;
    let allTrue = false;
    let allFalse = true;
    const categoriesLength = Object.keys(settings.categories).length;

    if (
      settings.includedCategories.length === categoriesLength &&
      settings.excludedRps.length === 0
    ) {
      allTrue = true;
    }

    if (settings.includedCategories.length > 0) {
      allFalse = false;
    }

    let body: string;

    // No-categories check
    if (!settings.allEnforced && categoriesLength === 0) {
      body = '{}';
    } else if (allTrue) {
      body = JSON.stringify({ all: true });
    } else if (allFalse) {
      body = '{}';
    } else {
      body = JSON.stringify({
        include_categories: settings.includedCategories,
        exclude_rps: settings.excludedRps,
      });
    }
    this.settingsBody = body;
  }

  /**
   * If the enforceMfa is false, this method tries to update settings directly.
   * If the enforceMfa is true, this method firstly fires logic for step-up and then updates settings.
   *
   * The age of the performed authentication is also checked. It shouldn't be older than MFA auth validity defined in
   * config file (default value is 900 seconds - 15 minutes). Otherwise, the step-up authentication is required. The age is checked
   * according to the 'auth_time' attribute in the access token. If this attribute does not exist
   * (it depends on instance proxy), this condition will be skipped.
   */
  saveSettings(enforceMfa = false): Observable<any> {
    return from(
      !(
        atob(this.oauthService.getAccessToken().split('.')[1])['auth_time'] <
        now() - this.mfaAuthValidity
      ) && !enforceMfa
        ? this.updateDetailSettings()
        : this.mfaHandlerService.openMfaWindow('MfaPrivilegeException').pipe(
            switchMap((verified) => {
              if (verified) {
                return this.saveSettings(false);
              }
              throw new Error(this.translate.instant('AUTHENTICATION.MFA_WINDOW_CLOSED_ERROR'));
            }),
          ),
    );
  }

  /**
   * Updates current settings for categories and services
   * If MFA error occurred, fires step-up logic via saveSettings method
   */
  private updateDetailSettings(): Observable<any> {
    return this.httpClient
      .put<any>(this.mfaApiUrl + 'settings', this.settingsBody, {
        headers: {
          Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
          // FIXME: at this time mfa api checks exact match on 'application/json' (without ; at the end)
          'content-type': 'application/json',
        },
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error.error === 'MFA is required') {
            // when token is valid, but user is logged in without MFA -> enforce MFA
            return this.saveSettings(true);
          } else {
            return throwError(() => err);
          }
        }),
      );
  }
}
