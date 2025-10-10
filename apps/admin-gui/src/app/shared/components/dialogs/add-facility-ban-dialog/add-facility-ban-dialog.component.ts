import { AddBanDialogComponent } from '../add-ban-dialog/add-ban-dialog.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  BanOnFacility,
  FacilitiesManagerService,
  PaginatedRichUsers,
  RichUser,
  UsersManagerService,
  UsersOrderColumn,
} from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { TABLE_BANS } from '@perun-web-apps/config/table-config';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddBanData, BanForm } from '../add-ban-dialog/add-ban-dialog.component';
import { GuiAuthResolver, NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { BehaviorSubject, finalize, merge, Observable, switchMap } from 'rxjs';
import { PageQuery, RPCError } from '@perun-web-apps/perun/models';
import { map, startWith, tap } from 'rxjs/operators';
import {
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
} from '@perun-web-apps/perun/utils';
import { ExportDataDialogComponent } from '@perun-web-apps/perun/table-utils';
import {
  userTableColumn,
  DebounceFilterComponent,
  UsersListComponent,
} from '@perun-web-apps/perun/components';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    DebounceFilterComponent,
    AddBanDialogComponent,
    UsersListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-add-facility-ban-dialog',
  templateUrl: './add-facility-ban-dialog.component.html',
  styleUrls: ['./add-facility-ban-dialog.component.scss'],
})
export class AddFacilityBanDialogComponent implements OnInit {
  selection = new SelectionModel<RichUser>(
    false,
    [],
    true,
    (richUser1, richUser2) => richUser1.id === richUser2.id,
  );
  ban: BanOnFacility;
  attrNames = [Urns.USER_DEF_PREFERRED_MAIL].concat(this.store.getLoginAttributeNames());
  displayedColumns: userTableColumn[] = ['select', 'id', 'name', 'email', 'logins'];
  tableId = TABLE_BANS;
  searchString = '';
  nextPage = new BehaviorSubject<PageQuery>({});
  routeAuth = false;
  usersPage$: Observable<PaginatedRichUsers> = this.nextPage.pipe(
    switchMap((pageQuery) =>
      this.usersManager
        .getUsersPage({
          attrNames: this.attrNames,
          query: {
            order: pageQuery.order,
            pageSize: pageQuery.pageSize,
            offset: pageQuery.offset,
            sortColumn: pageQuery.sortColumn as UsersOrderColumn,
            searchString: pageQuery.searchString,
            facilityId: this.data.entityId,
          },
        })
        .pipe(finalize(() => this.cd.detectChanges())),
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
    @Inject(MAT_DIALOG_DATA) public data: AddBanData<BanOnFacility>,
    private dialogRef: MatDialogRef<AddFacilityBanDialogComponent>,
    private store: StoreService,
    private facilityService: FacilitiesManagerService,
    private notificator: NotificatorService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private usersManager: UsersManagerService,
    private authResolver: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.selection.changed.subscribe((change) => {
      this.ban = this.data.bans.find((ban) => ban.userId === change.source.selected[0]?.id);
    });
    this.routeAuth = this.authResolver.isPerunAdminOrObserver();
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  submitBan(banForm: BanForm): void {
    if (!this.ban) {
      this.banUser(banForm);
    } else {
      this.updateBan(banForm);
    }
  }

  setFilter(filter: string): void {
    this.searchString = filter;
    this.selection.clear();
    this.cd.detectChanges();
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

    const call = this.usersManager
      .getUsersPage({
        attrNames: this.attrNames,
        query: {
          order: query.order,
          pageSize: a.length,
          offset: 0,
          sortColumn: query.sortColumn as UsersOrderColumn,
          searchString: query.searchString,
          facilityId: this.data.entityId,
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

  private banUser(banForm: BanForm): void {
    this.facilityService
      .setFacilityBan({
        banOnFacility: {
          userId: this.selection.selected[0].id,
          facilityId: this.data.entityId,
          description: banForm.description,
          validityTo: banForm.validity,
          id: 0,
          beanName: 'BanOnVo',
        },
      })
      .subscribe({
        next: () => {
          this.notificator.showSuccess('DIALOGS.ADD_BAN.SUCCESS_USER');
          this.dialogRef.close(true);
        },
      });
  }

  private updateBan(banForm: BanForm): void {
    this.facilityService
      .updateFacilityBan({
        banOnFacility: {
          id: this.ban.id,
          beanName: 'BanOnFacility',
          facilityId: this.ban.facilityId,
          userId: this.ban.userId,
          description: banForm.description,
          validityTo: banForm.validity,
        },
      })
      .subscribe({
        next: () => {
          this.notificator.showSuccess('DIALOGS.UPDATE_BAN.SUCCESS');
          this.dialogRef.close(true);
        },
      });
  }
}
