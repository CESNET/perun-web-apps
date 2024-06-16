import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  BlockedLogin,
  BlockedLoginsOrderColumn,
  PaginatedBlockedLogins,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { TABLE_ADMIN_BLOCKED_LOGINS } from '@perun-web-apps/config/table-config';
import {
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
} from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { UnblockLoginsDialogComponent } from '../../../../shared/components/dialogs/unblock-logins-dialog/unblock-logins-dialog.component';
import { BlockLoginsDialogComponent } from '../../../../shared/components/dialogs/block-logins-dialog/block-logins-dialog.component';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { FormControl } from '@angular/forms';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { PageQuery } from '@perun-web-apps/perun/models';
import { map, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-perun-web-apps-admin-blocked-logins',
  templateUrl: './admin-blocked-logins.component.html',
  styleUrls: ['./admin-blocked-logins.component.scss'],
})
export class AdminBlockedLoginsComponent implements OnInit {
  tableId = TABLE_ADMIN_BLOCKED_LOGINS;
  isAdmin = false;

  searchString: string;
  selection: SelectionModel<BlockedLogin> = new SelectionModel<BlockedLogin>(
    true,
    [],
    true,
    (blockedLogin1, blockedLogin2) => blockedLogin1.id === blockedLogin2.id,
  );

  logins: BlockedLogin[] = [];

  namespaceOptions: string[] = [];
  filterOptions: string[] = [];
  selectedNamespaces: string[] = [];
  namespaces = new FormControl();
  displayedColumns = ['checkbox', 'login', 'namespace'];

  blockedLogins: BlockedLogin[] = [];
  nextPage = new BehaviorSubject<PageQuery>({});
  blockedLoginsPage$: Observable<PaginatedBlockedLogins> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.userManager.getBlockedLoginsPage({
        query: {
          order: pageQuery.order,
          pageSize: pageQuery.pageSize,
          offset: pageQuery.offset,
          sortColumn: pageQuery.sortColumn as BlockedLoginsOrderColumn,
          searchString: pageQuery.searchString,
          namespaces: this.selectedNamespaces,
        },
      }),
    ),
    // 'Tapping' is generally a last resort
    tap((page) => {
      this.blockedLogins = page.data;
      this.selection.clear();
      setTimeout(() => this.loadingSubject$.next(false), 200);
    }),
    startWith({ data: [], totalCount: 0, offset: 0, pageSize: 0 }),
  );
  loadingSubject$ = new BehaviorSubject(false);
  cacheSubject = new BehaviorSubject(true);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );

  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private attributesService: AttributesManagerService,
    public authResolver: GuiAuthResolver,
    private userManager: UsersManagerService,
  ) {}

  refreshTable(): void {
    this.cacheSubject.next(true);
    this.nextPage.next(this.nextPage.value);
  }

  onSearchByString(searchString: string): void {
    this.searchString = searchString;
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.namespaces.setValue(this.selectedNamespaces);
    this.isAdmin = this.authResolver.isPerunAdmin();

    this.attributesService.getAllNamespaces().subscribe((res) => {
      this.namespaceOptions = res;
      this.filterOptions = [''].concat(res);
    });
  }

  block(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      theme: 'admin-theme',
      namespaceOptions: this.namespaceOptions,
    };

    const dialogRef = this.dialog.open(BlockLoginsDialogComponent, config);

    dialogRef.afterClosed().subscribe((wereLoginsBlocked) => {
      if (wereLoginsBlocked) {
        this.refreshTable();
      }
    });
  }

  unblock(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = {
      logins: this.selection.selected,
      theme: 'admin-theme',
    };

    const dialogRef = this.dialog.open(UnblockLoginsDialogComponent, config);

    dialogRef.afterClosed().subscribe((wereLoginsUnblocked) => {
      if (wereLoginsUnblocked) {
        this.refreshTable();
      }
    });
  }

  toggleEvent(namespaces: string[]): void {
    // Replace array in-place so it won't trigger ngOnChanges
    this.selectedNamespaces.splice(
      0,
      this.selectedNamespaces.length,
      ...namespaces.map((namespace) => (namespace === '' ? null : namespace)),
    );
  }

  refreshOnClosed(): void {
    this.selectedNamespaces = [...this.selectedNamespaces];
    this.refreshTable();
  }

  downloadAll(a: {
    format: string;
    length: number;
    getDataForColumnFun: (data: BlockedLogin, column: string) => string;
  }): void {
    const query = this.nextPage.getValue();

    this.userManager
      .getBlockedLoginsPage({
        query: {
          order: query.order,
          pageSize: a.length,
          offset: 0,
          sortColumn: query.sortColumn as BlockedLoginsOrderColumn,
          searchString: query.searchString,
          namespaces: this.selectedNamespaces,
        },
      })
      .subscribe({
        next: (paginatedGroups) => {
          downloadData(
            getDataForExport(paginatedGroups.data, this.displayedColumns, a.getDataForColumnFun),
            a.format,
          );
        },
      });
  }
}
