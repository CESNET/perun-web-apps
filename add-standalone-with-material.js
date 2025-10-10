const fs = require('fs');
const path = require('path');

const SRC_DIRS = ['apps', 'libs'];

// Map Material selectors to modules + import paths
const materialMap = {
  // Buttons & Forms
  'mat-button': { module: 'MatButtonModule', path: '@angular/material/button' },
  'matButton': { module: 'MatButtonModule', path: '@angular/material/button' },
  'mat-stroked-button': { module: 'MatButtonModule', path: '@angular/material/button' },
  'mat-flat-button': { module: 'MatButtonModule', path: '@angular/material/button' },
  'mat-icon-button': { module: 'MatButtonModule', path: '@angular/material/button' },
  'mat-icon': { module: 'MatIconModule', path: '@angular/material/icon' },
  'mat-form-field': { module: 'MatFormFieldModule', path: '@angular/material/form-field' },
  'mat-input': { module: 'MatInputModule', path: '@angular/material/input' },
  'matInput': { module: 'MatInputModule', path: '@angular/material/input' },
  'mat-select': { module: 'MatSelectModule', path: '@angular/material/select' },
  'mat-checkbox': { module: 'MatCheckboxModule', path: '@angular/material/checkbox' },
  'mat-radio-button': { module: 'MatRadioModule', path: '@angular/material/radio' },
  'mat-slide-toggle': { module: 'MatSlideToggleModule', path: '@angular/material/slide-toggle' },
  'formControl': { module: 'ReactiveFormsModule', path: '@angular/forms' },
  'formGroup': { module: 'ReactiveFormsModule', path: '@angular/forms' },
  'mat-datepicker': { module: 'MatDatepickerModule', path: '@angular/material/datepicker' },
  'matDatepicker': { module: 'MatDatepickerModule', path: '@angular/material/datepicker' },
  'ngModel': { module: 'FormsModule', path: '@angular/forms' },
  '(ngModel)': { module: 'ReactiveFormsModule', path: '@angular/forms' },
  'cdkCopyToClipboard': { module: 'CdkCopyToClipboard', path: '@angular/cdk/clipboard' },
  'mat-autocomplete': { module: 'MatAutocompleteModule', path: '@angular/material/autocomplete' },
  'matAutocomplete': { module: 'MatAutocompleteModule', path: '@angular/material/autocomplete' },

  // Dialogs
  'mat-dialog': { module: 'MatDialogModule', path: '@angular/material/dialog' },
  'mat-dialog-title': { module: 'MatDialogModule', path: '@angular/material/dialog' },
  'mat-dialog-content': { module: 'MatDialogModule', path: '@angular/material/dialog' },
  'mat-dialog-actions': { module: 'MatDialogModule', path: '@angular/material/dialog' },

  // Perun custom
  'perun-web-apps-alert': { module: 'UiAlertsModule', path: '@perun-web-apps/ui/alerts' },
  'customTranslate': { module: 'CustomTranslatePipe', path: '@perun-web-apps/perun/pipes' },
  'isAllSelected': { module: 'IsAllSelectedPipe', path: '@perun-web-apps/perun/pipes' },
  'parseDate': { module: 'ParseDatePipe', path: '@perun-web-apps/perun/pipes' },
  'memberStatusIcon': { module: 'MemberStatusIconPipe', path: '@perun-web-apps/perun/pipes' },
  'memberStatus': { module: 'MemberStatusPipe', path: '@perun-web-apps/perun/pipes' },
  'transformMemberStatus': { module: 'TransformMemberStatusPipe', path: '@perun-web-apps/perun/pipes' },
  'perun-web-apps-footer': { module: 'PerunFooterComponent', path: '@perun-web-apps/perun/components' },
  'perun-web-apps-header': { module: 'PerunHeaderComponent', path: '@perun-web-apps/perun/components' },
  'perunWebAppsMiddleClickRouterLink': { module: 'MiddleClickRouterLinkDirective', path: '@perun-web-apps/perun/directives' },
  'perun-web-apps-loading-dialog': { module: 'LoadingDialogComponent', path: '@perun-web-apps/ui/loaders' },
  'perun-web-apps-back-button': { module : 'PerunSharedComponentsModule', path: '@perun-web-apps/perun/components' },
  'perun-web-apps-delete-entity-dialog': { module : 'DeleteEntityDialogComponent', path: '@perun-web-apps/perun/dialogs' },
  'perun-web-apps-table-wrapper': { module : 'TableWrapperComponent', path: '@perun-web-apps/perun/table-utils' },
  '<perun-web-apps-table-wrapper': { module : 'TableWrapperComponent', path: '@perun-web-apps/perun/table-utils' },
  'perun-web-apps-recently-viewed-icon': { module : 'RecentlyViewedIconComponent', path: '@perun-web-apps/perun/components' },
  'perun-web-apps-entity-search-select': { module : 'EntitySearchSelectComponent', path: '@perun-web-apps/perun/components' },
  'perun-web-apps-debounce-filter': { module : 'DebounceFilterComponent', path: '@perun-web-apps/perun/components' },
  'perun-web-apps-mailing-lists': { module : 'MailingListsComponent', path: '@perun-web-apps/perun/components' },
  'perun-web-apps-data-quotas': { module : 'DataQuotasComponent', path: '@perun-web-apps/perun/components' },
  'perun-web-apps-expiration-select': { module : 'ExpirationSelectComponent', path: '@perun-web-apps/perun/dialogs' },
  'perun-web-apps-refresh-button': { module : 'RefreshButtonComponent', path: '@perun-web-apps/perun/components' },
  'app-managers-page': { module : 'ManagersPageComponent', path: '@perun-web-apps/perun/shared' },
  'app-group-roles-filter': { module : 'GroupRolesFilterComponent', path: '@perun-web-apps/perun/shared' },
  'app-one-entity-attribute-page': { module : 'OneEntityAttributePageComponent', path: '@perun-web-apps/perun/shared' },
  'app-two-entity-attribute-page': { module : 'TwoEntityAttributePageComponent', path: '@perun-web-apps/perun/shared' },
  'app-application-actions': { module : 'ApplicationActionsComponent', path: '@perun-web-apps/perun/shared' },
  'app-animated-router-outlet': { module : 'AnimatedRouterOutletComponent', path: '@perun-web-apps/perun/shared' },
  'app-update-ban-dialog': { module : 'UpdateBanDialogComponent', path: '@perun-web-apps/perun/shared' },
  'app-add-ban-dialog': { module : 'AddBanDialogComponent', path: '@perun-web-apps/perun/shared' },
  'app-perun-web-apps-roles-page': { module : 'RolesPageComponent', path: '@perun-web-apps/perun/shared' },
  'perun-web-apps-menu-buttons-field': { module : 'MenuButtonsFieldComponent', path: '@perun-web-apps/perun/components' },
  'perun-web-apps-expandable-tiles': { module : 'ExpandableTilesComponent', path: '@perun-web-apps/perun/components' },
  'perun-web-apps-members-list': { module : 'MembersListComponent', path: '@perun-web-apps/perun/components' },

  // Navigation & Layout
  'mat-toolbar': { module: 'MatToolbarModule', path: '@angular/material/toolbar' },
  'mat-sidenav': { module: 'MatSidenavModule', path: '@angular/material/sidenav' },
  'mat-menu': { module: 'MatMenuModule', path: '@angular/material/menu' },
  'mat-list': { module: 'MatListModule', path: '@angular/material/list' },
  'mat-tabs': { module: 'MatTabsModule', path: '@angular/material/tabs' },
  'mat-tab': { module: 'MatTabsModule', path: '@angular/material/tabs' },
  'mat-tab-group': { module: 'MatTabsModule', path: '@angular/material/tabs' },
  'router-outlet': { module: 'RouterModule', path: '@angular/router' },
  'routerLink': { module: 'RouterModule', path: '@angular/router' },
  'mat-accordion' : { module: 'MatExpansionModule', path: '@angular/material/expansion' },
  'mat-expansion-panel' : { module: 'MatExpansionModule', path: '@angular/material/expansion' },
  'mat-nav-list' : { module: 'MatNavList', path: '@angular/material/list' },
  'mat-list-item' : { module: 'MatListItem', path: '@angular/material/list' },
  'mat-divider' : { module: 'MatDivider', path: '@angular/material/divider' },
  'mat-card' : { module: 'MatCardModule', path: '@angular/material/card' },

  // Data table
  'mat-table': { module: 'MatTableModule', path: '@angular/material/table' },
  'mat-paginator': { module: 'MatPaginatorModule', path: '@angular/material/paginator' },
  'mat-sort': { module: 'MatSortModule', path: '@angular/material/sort' },
  'matSort': { module: 'MatSortModule', path: '@angular/material/sort' },

  // Feedback
  'mat-progress-bar': { module: 'MatProgressBarModule', path: '@angular/material/progress-bar' },
  'mat-progress-spinner': { module: 'MatProgressSpinnerModule', path: '@angular/material/progress-spinner' },
  'mat-spinner': { module: 'MatProgressSpinnerModule', path: '@angular/material/progress-spinner' },
  'matRipple': { module: 'MatRipple', path: '@angular/material/core' },
  'translate': {module: 'TranslateModule', path: '@ngx-translate/core'},
  'matTooltip': { module: 'MatTooltip', path: '@angular/material/tooltip' },
};

// --- Helpers ---
function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else if (fullPath.endsWith('.ts')) {
      callback(fullPath);
    }
  });
}

function getTemplateContent(tsFile) {
  const content = fs.readFileSync(tsFile, 'utf8');
  const match = content.match(/templateUrl\s*:\s*['"](.*?)['"]/);
  if (match) {
    const htmlPath = path.resolve(path.dirname(tsFile), match[1]);
    if (fs.existsSync(htmlPath)) {
      return fs.readFileSync(htmlPath, 'utf8');
    }
  }
  return '';
}

function ensureImport(updated, moduleName, importPath) {
  const importRegex = new RegExp(
    `import\\s*\\{([^}]*)\\}\\s*from\\s*['"]${importPath}['"]`,
    'm'
  );

  if (importRegex.test(updated)) {
    // Append to existing import from same path if missing
    updated = updated.replace(importRegex, (match, imports) => {
      const importList = imports.split(',').map(s => s.trim()).filter(Boolean);
      if (!importList.includes(moduleName)) {
        importList.push(moduleName);
      }
      return `import { ${importList.join(', ')} } from '${importPath}'`;
    });
  } else {
    // Add new import
    updated = `import { ${moduleName} } from '${importPath}';\n` + updated;
  }

  return updated;
}

function ensureDecoratorImport(updated, moduleName) {
  // Check specifically inside @Component imports, not the whole file
  const componentRegex = /imports\s*:\s*\[([\s\S]*?)\]/m;

  if (componentRegex.test(updated)) {
    updated = updated.replace(componentRegex, (match, existing) => {
      // Only add if not already inside the array
      if (!new RegExp(`\\b${moduleName}\\b`).test(existing)) {
        const trimmed = existing.trim();
        return `imports: [${trimmed}${trimmed ? ', ' : ''}${moduleName}]`;
      }
      return match;
    });
  }

  return updated;
}

function isSelectorUsed(html, selector) {
  // Case 1: element
  const elementRegex = new RegExp(`<\\s*${selector}\\b`, 'i');
  if (elementRegex.test(html)) return true;

  // Case 2: attribute (plain, no brackets)
  const attributeRegex = new RegExp(`<[^>]*\\s${selector}(\\s|>|=)`, 'i');
  if (attributeRegex.test(html)) return true;

  // Case 3: property binding like [formControl]
  const propertyRegex = new RegExp(`<[^>]*\\[\\s*${selector}\\s*\\]`, 'i');
  if (propertyRegex.test(html)) return true;

  // Case 4: two-way binding like [(ngModel)]
  const bananaRegex = new RegExp(`<[^>]*\\[\\(${selector}\\)\\]`, 'i');
  if (bananaRegex.test(html)) return true;

  // Case 5: pipe usage
  const pipeRegex = new RegExp(`\\|\\s*${selector}\\b`, 'i');
  return pipeRegex.test(html);
}

// --- Main migration ---
function migrateFile(filePath) {
  let source = fs.readFileSync(filePath, 'utf8');

  if (!/@Component|@Directive|@Pipe/.test(source)) return;

  let updated = source;
  let isComponent = /@Component/.test(source);

  // Add standalone: true
  if (!/standalone\s*:\s*true/.test(source)) {
    updated = updated.replace(
      /(@Component|@Directive|@Pipe)\s*\(\s*\{/,
      `$1({\n  standalone: true,`
    );
  }

  // For components, ensure CommonModule in imports array
  if (isComponent) {
    if (!/imports\s*:\s*\[/.test(updated)) {
      updated = updated.replace(/(@Component\s*\(\s*\{)/, `$1\n  imports: [CommonModule],`);
    } else if (!/CommonModule/.test(updated)) {
      updated = updated.replace(/(imports\s*:\s*\[)/, `$1CommonModule, `);
    }
    updated = ensureImport(updated, 'CommonModule', '@angular/common');
  }

  // Detect Material usage in template
  if (isComponent) {
    const html = getTemplateContent(filePath);
    for (const selector in materialMap) {
      const { module, path } = materialMap[selector];
      if (isSelectorUsed(html, selector)) {
        console.log(selector)
        // Ensure TS import exists at top
        updated = ensureImport(updated, module, path);
        // Ensure it’s listed inside the decorator
        updated = ensureDecoratorImport(updated, module);
      }
    }
  }

  if (updated !== source) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

// --- Run migration ---
SRC_DIRS.forEach(dir => {
  if (fs.existsSync(dir)) {
    walk(dir, migrateFile);
  }
});
