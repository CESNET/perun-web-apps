import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, HostBinding, OnInit } from '@angular/core';
import { Urns } from '@perun-web-apps/perun/urns';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { BehaviorSubject, merge, Observable, switchMap } from 'rxjs';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import {
  PaginatedRichUsers,
  RichUser,
  UsersManagerService,
  UsersOrderColumn,
} from '@perun-web-apps/perun/openapi';
import { PageQuery, RPCError } from '@perun-web-apps/perun/models';
import { map, startWith, tap } from 'rxjs/operators';
import {
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
} from '@perun-web-apps/perun/utils';
import { ExportDataDialogComponent } from '@perun-web-apps/perun/table-utils';
import { MatDialog } from '@angular/material/dialog';
import {
  userTableColumn,
  DebounceFilterComponent,
  RefreshButtonComponent,
  UsersListComponent,
} from '@perun-web-apps/perun/components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatCheckboxModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    UsersListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  static id = 'AdminUsersComponent';

  @HostBinding('class.router-component') true;

  usersWithoutVo = false;
  searchString: string;
  attributes: string[] = [];
  displayedColumns: userTableColumn[] = ['user', 'id', 'name', 'email', 'logins', 'organization'];
  nextPage = new BehaviorSubject<PageQuery>({});
  usersPage$: Observable<PaginatedRichUsers> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.userManager.getUsersPage({
        attrNames: this.attributes,
        query: {
          order: pageQuery.order,
          pageSize: pageQuery.pageSize,
          offset: pageQuery.offset,
          sortColumn: pageQuery.sortColumn as UsersOrderColumn,
          searchString: this.searchString,
          withoutVo: this.usersWithoutVo,
        },
      }),
    ),
    tap(() => {
      setTimeout(() => this.loadingSubject$.next(false), 200);
    }),
    startWith({ data: [], totalCount: 0, offset: 0, pageSize: 0 }),
  );
  loadingSubject$ = new BehaviorSubject<boolean>(false);
  resetPagination = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );

  constructor(
    private storeService: StoreService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private cacheHelperService: CacheHelperService,
    private userManager: UsersManagerService,
    private destroyRef: DestroyRef,
    private notificator: NotificatorService,
  ) {}

  ngOnInit(): void {
    this.attributes = [Urns.USER_DEF_ORGANIZATION, Urns.USER_DEF_PREFERRED_MAIL];
    this.attributes = this.attributes.concat(this.storeService.getLoginAttributeNames());

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === AdminUsersComponent.id) {
          this.refresh();
        }
      });
  }

  filterSearchString(searchString: string): void {
    this.searchString = searchString;
    this.cd.detectChanges();
  }

  filterUserWithoutVO(): void {
    this.usersWithoutVo = !this.usersWithoutVo;
    this.refresh();
  }

  refresh(): void {
    this.resetPagination.next(true);
    this.nextPage.next(this.nextPage.value);
  }

  downloadAll(a: {
    format: string;
    length: number;
    getDataForColumnFun: (data: RichUser, column: string) => string;
  }): void {
    const query = this.nextPage.getValue();

    const config = getDefaultDialogConfig();
    config.width = '500px';
    const exportLoading = this.dialog.open(ExportDataDialogComponent, config);

    const call = this.userManager
      .getUsersPage({
        attrNames: this.attributes,
        query: {
          order: query.order,
          pageSize: a.length,
          offset: 0,
          sortColumn: query.sortColumn as UsersOrderColumn,
          searchString: query.searchString,
          withoutVo: this.usersWithoutVo,
        },
      })
      .subscribe({
        next: (paginatedUsers) => {
          exportLoading.close();
          downloadData(
            getDataForExport(paginatedUsers.data, this.displayedColumns, a.getDataForColumnFun),
            a.format,
          );
        },
        error: (err: RPCError) => {
          this.notificator.showRPCError(err);
          exportLoading.close();
        },
      });

    exportLoading.afterClosed().subscribe(() => {
      if (call) {
        call.unsubscribe();
      }
    });
  }
}
