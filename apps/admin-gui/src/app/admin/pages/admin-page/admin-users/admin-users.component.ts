import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { TABLE_ADMIN_USER_SELECT } from '@perun-web-apps/config/table-config';
import { Urns } from '@perun-web-apps/perun/urns';
import { StoreService } from '@perun-web-apps/perun/services';
import { BehaviorSubject, merge, Observable, switchMap } from 'rxjs';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import {
  PaginatedRichUsers,
  RichUser,
  UsersManagerService,
  UsersOrderColumn,
} from '@perun-web-apps/perun/openapi';
import { PageQuery } from '@perun-web-apps/perun/models';
import { map, startWith, tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import {
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
} from '@perun-web-apps/perun/utils';
import { ExportDataDialogComponent } from '@perun-web-apps/perun/dialogs';
import { MatDialog } from '@angular/material/dialog';
import { userTableColumn } from '@perun-web-apps/perun/components';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  static id = 'AdminUsersComponent';

  @HostBinding('class.router-component') true;

  usersWithoutVo = false;
  searchString: string;
  selection = new SelectionModel<RichUser>(true, []);
  tableId = TABLE_ADMIN_USER_SELECT;
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
      this.selection.clear();
      setTimeout(() => this.loadingSubject$.next(false), 200);
    }),
    startWith({ data: [], totalCount: 0, offset: 0, pageSize: 0 }),
  );
  loadingSubject$ = new BehaviorSubject<boolean>(false);
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
  ) {}

  ngOnInit(): void {
    this.attributes = [Urns.USER_DEF_ORGANIZATION, Urns.USER_DEF_PREFERRED_MAIL];
    this.attributes = this.attributes.concat(this.storeService.getLoginAttributeNames());

    // Refresh cached data
    this.cacheHelperService.refreshComponentCachedData().subscribe((nextValue) => {
      if (nextValue) {
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
    this.nextPage.next(this.nextPage.value);
  }

  downloadAll(a: {
    format: string;
    length: number;
    getDataForColumnFun: (data: RichUser, column: string) => string;
  }): void {
    const query = this.nextPage.getValue();

    const config = getDefaultDialogConfig();
    config.width = '300px';
    const exportLoading = this.dialog.open(ExportDataDialogComponent, config);

    this.userManager
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
      });
  }
}
