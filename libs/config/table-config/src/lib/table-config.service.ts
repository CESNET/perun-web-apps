import { EventEmitter, Injectable } from '@angular/core';
import { GUIConfigService, LS_TABLE_PREFIX, PREF_PAGE_SIZE } from './guiconfig.service';

@Injectable({
  providedIn: 'root',
})
export class TableConfigService {
  defaultTableSizes = new Map<string, number>();
  globalPageSizeChanged = new EventEmitter<void>();
  showIdsChanged = new EventEmitter<boolean>();

  constructor(private guiConfigService: GUIConfigService) {
    this.defaultTableSizes.set('perun-web-apps-attributes-list', 25);
    this.defaultTableSizes.set('app-attr-def-list', 25);
  }

  getTablePageSize(tableId: string, routeUrl?: string): number {
    const tablePref = this.guiConfigService.getNumber(this.getTableStorageKey(tableId, routeUrl));
    if (!isNaN(tablePref)) {
      return tablePref;
    }

    const pref = this.guiConfigService.getNumber(PREF_PAGE_SIZE);
    if (!isNaN(pref)) {
      return pref;
    }

    return this.defaultTableSizes.get(tableId) ?? 10;
  }

  setTablePageSize(tableId: string, value: number, routeUrl?: string): void {
    if (tableId !== undefined) {
      this.guiConfigService.setNumber(this.getTableStorageKey(tableId, routeUrl), value);
    }
  }

  setGlobalPageSizeChanged(): void {
    this.globalPageSizeChanged.emit();
  }

  setShowIds(show: boolean): void {
    this.showIdsChanged.emit(show);
  }

  private getTableStorageKey(tableId: string, routeUrl?: string): string {
    const normalizedRoute = this.normalizeRoute(routeUrl);
    const suffix = normalizedRoute ? `${tableId}|${normalizedRoute}` : tableId;
    return LS_TABLE_PREFIX + suffix;
  }

  private normalizeRoute(routeUrl?: string): string | undefined {
    if (!routeUrl) {
      return undefined;
    }

    const withoutQuery = routeUrl.split(/[?#]/)[0];
    const withoutNumbers = withoutQuery.replace(/\d+/g, '');
    const normalizedSlashes = withoutNumbers.replace(/\/{2,}/g, '/');

    const trimmed =
      normalizedSlashes.endsWith('/') && normalizedSlashes !== '/'
        ? normalizedSlashes.slice(0, -1)
        : normalizedSlashes;

    return trimmed || undefined;
  }
}
