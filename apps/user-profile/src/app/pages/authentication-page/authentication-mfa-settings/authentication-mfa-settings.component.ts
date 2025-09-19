import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
/* eslint-disable
   @typescript-eslint/no-explicit-any,
   @typescript-eslint/explicit-module-boundary-types,
   @typescript-eslint/no-unsafe-member-access,
   @typescript-eslint/no-unsafe-assignment */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MfaApiService, StoreService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MfaSettings } from '@perun-web-apps/perun/models';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { CategoryLabelPipe } from '../../../pipes/category-label.pipe';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    UiAlertsModule,
    CustomTranslatePipe,
    MatExpansionModule,
    MatProgressSpinnerModule,
    TranslateModule,
    CategoryLabelPipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-authentication-mfa-settings',
  templateUrl: './authentication-mfa-settings.component.html',
  styleUrls: ['./authentication-mfa-settings.component.scss'],
})
export class AuthenticationMfaSettingsComponent implements OnInit {
  @ViewChild('master') checkbox: MatCheckbox;

  mfaAvailable = false;
  loadingMfa = false;
  errorTooltip = 'AUTHENTICATION.MFA_DISABLED';

  enforceMfa: boolean;
  enableDetailSettings = true;
  loadingCategories = false;
  unchangedSettings = true;
  categorySelection: SelectionModel<string>;
  rpsSelections: Map<string, SelectionModel<string>> = new Map<string, SelectionModel<string>>();
  allRpsSelected = false;

  mfaUrl = '';
  settings: MfaSettings;
  cachedSettings: MfaSettings;

  // need these because can't call Object.keys in template
  allCategoriesKeys: string[] = [];
  allRpsKeysByCategory: Map<string, string[]> = new Map();

  constructor(
    public translate: TranslateService,
    private store: StoreService,
    private mfaApiService: MfaApiService,
  ) {}

  ngOnInit(): void {
    this.loadingMfa = true;
    this.cachedSettings = this.mfaApiService.getCachedSettings();
    const mfa = this.store.getProperty('mfa');
    this.translate.onLangChange.subscribe(() => {
      this.mfaUrl = this.translate.currentLang === 'en' ? mfa.url_en : mfa.url_cs;
    });

    this.mfaUrl = this.translate.currentLang === 'en' ? mfa.url_en : mfa.url_cs;
    this.categorySelection = new SelectionModel<string>(true, []);
    this.mfaApiService.isMfaAvailable().subscribe({
      next: (isAvailable) => {
        this.mfaAvailable = isAvailable;
        if (this.mfaAvailable) {
          this.loadingCategories = true;
          this.loadSettings();
        } else {
          this.loadingMfa = false;
        }
      },
      error: (err) => {
        console.error(err);
        this.errorTooltip = 'AUTHENTICATION.MFA_ERROR';
        this.loadingMfa = false;
      },
    });
  }

  /**
   * Load setting from the backend or restore it from the cache
   *
   * Restore settings from cache just for the use case when MFA window for the step-up is closed manually
   * - then clear the cache to avoid caching out of this scope (like after routing etc.)
   */
  loadSettings(): void {
    if (this.cachedSettings) {
      this.settings = this.cachedSettings;
      this.setSelections();
      this.unchangedSettings = false;
      this.loadingCategories = false;
      this.loadingMfa = false;
    } else {
      this.mfaApiService.getSettings().subscribe({
        next: (settings) => {
          this.settings = settings;
          this.setSelections();
          this.loadingCategories = false;
          this.loadingMfa = false;
        },
        error: () => {
          this.loadingMfa = false;
          this.loadingCategories = false;
        },
      });
    }
  }

  setSelections(): void {
    // Check if the settings have categories
    this.enableDetailSettings =
      this.settings.categories && Object.keys(this.settings.categories).length > 0;
    this.categorySelection = new SelectionModel<string>(true, this.settings.includedCategories);
    this.allCategoriesKeys = Object.keys(this.settings.categories);
    // Select if 'allEnforced' is true
    this.enforceMfa = this.settings.includedCategories.length > 0 || this.settings.allEnforced;
    for (const category in this.settings.categories) {
      this.allRpsKeysByCategory.set(
        category,
        Object.keys(this.settings.rpsByCategory[category] as object),
      );
      this.rpsSelections.set(
        category,
        new SelectionModel<string>(true, this.settings.includedRpsByCategory[category] as string[]),
      );
    }
    this.checkAllRpsSelected();
  }

  toggleEnableMfa(checked: boolean): void {
    this.unchangedSettings = false;
    if (checked) {
      this.categorySelection.setSelection(...Object.keys(this.settings.categories));
      for (const category in this.settings.categories) {
        this.rpsSelections
          .get(category)
          .setSelection(...Object.keys(this.settings.rpsByCategory[category] as object));
      }
    } else {
      this.categorySelection.clear();
      for (const category in this.settings.categories) {
        this.rpsSelections.get(category).clear();
      }
    }
    this.checkAllRpsSelected();
  }

  toggleCategory(categoryAny: any, checked: boolean): void {
    this.unchangedSettings = false;
    const category = String(categoryAny);
    if (checked) {
      this.categorySelection.select(category);
      for (const rps in this.settings.rpsByCategory[category]) {
        this.rpsSelections.get(category).select(rps);
      }
      this.enforceMfa = true;
    } else {
      this.categorySelection.deselect(category);
      this.rpsSelections.get(category).clear();
      if (this.categorySelection.isEmpty()) {
        this.enforceMfa = false;
      }
    }
    this.checkAllRpsSelected();
  }

  toggleRps(categoryAny: any, rpsAny: any, checked: boolean): void {
    const rps = String(rpsAny);
    const category = String(categoryAny);
    this.unchangedSettings = false;
    if (checked) {
      this.rpsSelections.get(category).select(rps);
      this.categorySelection.select(category);
      this.enforceMfa = true;
    } else {
      this.rpsSelections.get(category).deselect(rps);
      if (this.rpsSelections.get(category).isEmpty()) {
        this.categorySelection.deselect(category);
        if (this.categorySelection.isEmpty()) {
          this.enforceMfa = false;
        }
      }
    }
    this.checkAllRpsSelected();
  }

  /**
   * This method fires logic for setting new values of settings
   * After the error clear the cached settings
   */
  saveSettings(): void {
    this.loadingMfa = true;
    this.saveDetailSettings();
    this.mfaApiService.saveSettings().subscribe({
      next: () => {
        this.unchangedSettings = true;
        this.loadingMfa = false;
      },
      error: (err) => {
        console.error(err);
        this.mfaApiService.clearCachedSettings();
        this.loadingMfa = false;
      },
    });
  }

  checkAllRpsSelected(): void {
    for (const category in this.settings.categories) {
      if (
        this.rpsSelections.get(category).selected.length !==
        Object.keys(this.settings.rpsByCategory[category] as object).length
      ) {
        this.allRpsSelected = false;
        return;
      }
    }
    this.allRpsSelected = true;
  }

  /**
   * This method creates request body for new settings according to toggles
   */
  saveDetailSettings(): void {
    // enforce all only if all rps + categories are truly checked (checkbox isn't indeterminate)
    this.settings.allEnforced = this.enforceMfa && !this.checkbox.indeterminate;
    this.settings.includedCategories = this.categorySelection.selected;
    this.settings.excludedRps = [];
    for (const category of this.settings.includedCategories) {
      this.settings.includedRpsByCategory[category] = this.rpsSelections.get(category).selected;
      this.settings.excludedRps.push(
        ...Object.keys(this.settings.rpsByCategory[category] as object).filter(
          (rps) => !this.rpsSelections.get(category).selected.includes(rps),
        ),
      );
    }

    this.mfaApiService.saveDetailSettings(this.settings);
  }

  redirectToMfaTokensPage(): void {
    window.open(this.mfaUrl, '_blank');
  }
}
