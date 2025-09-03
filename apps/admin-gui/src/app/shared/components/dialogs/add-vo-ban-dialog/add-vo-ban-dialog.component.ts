import { AddBanDialogComponent } from '../add-ban-dialog/add-ban-dialog.component';
import { DebounceFilterComponent, MembersListComponent } from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import {
  BanOnVo,
  MembersManagerService,
  PaginatedRichMembers,
  RichMember,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { TABLE_BANS } from '@perun-web-apps/config/table-config';
import {
  MembersListService,
  NotificatorService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { AddBanData, BanForm } from '../add-ban-dialog/add-ban-dialog.component';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { PageQuery, RPCError } from '@perun-web-apps/perun/models';
import { map } from 'rxjs/operators';
import {
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
} from '@perun-web-apps/perun/utils';
import { ExportDataDialogComponent } from '@perun-web-apps/perun/table-utils';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    DebounceFilterComponent,
    AddBanDialogComponent,
    MembersListComponent,
    LoadingTableComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-add-vo-ban-dialog',
  templateUrl: './add-vo-ban-dialog.component.html',
  styleUrls: ['./add-vo-ban-dialog.component.scss'],
})
export class AddVoBanDialogComponent implements OnInit {
  selection: SelectionModel<RichMember> = new SelectionModel<RichMember>(
    false,
    [],
    true,
    (richMember1, richMember2) => richMember1.id === richMember2.id,
  );
  ban: BanOnVo;
  loading = false;
  attrNames = [Urns.MEMBER_DEF_MAIL, Urns.USER_DEF_PREFERRED_MAIL].concat(
    this.store.getLoginAttributeNames(),
  );
  displayedColumns = ['checkbox', 'id', 'fullName', 'email', 'logins'];
  tableId = TABLE_BANS;
  filter = '';
  voId: number;
  nextPage = new BehaviorSubject<PageQuery>({});
  membersPage$: Observable<PaginatedRichMembers>;
  loadingSubject$ = new BehaviorSubject(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddBanData<BanOnVo>,
    private dialogRef: MatDialogRef<AddVoBanDialogComponent>,
    private store: StoreService,
    private voService: VosManagerService,
    private notificator: NotificatorService,
    private membersService: MembersManagerService,
    private membersListService: MembersListService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.voId = this.data.entityId;
    this.membersPage$ = this.membersListService.nextPageHandler(
      this.nextPage,
      this.membersService,
      this.voId,
      this.attrNames,
      null,
      null,
      null,
      this.selection,
      this.loadingSubject$,
    );

    this.selection.changed.subscribe((change) => {
      this.ban = this.data.bans.find((ban) => ban.memberId === change.source.selected[0]?.id);
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  submitBan(banForm: BanForm): void {
    if (!this.ban) {
      this.banMember(banForm);
    } else {
      this.updateBan(banForm);
    }
  }

  setFilter(filter: string): void {
    this.filter = filter;
    this.nextPage.next(this.nextPage.value);
  }

  downloadAll(a: {
    format: string;
    length: number;
    getDataForColumnFun: (data: RichMember, column: string) => string;
  }): void {
    const pageQuery = this.nextPage.getValue();

    const config = getDefaultDialogConfig();
    config.width = '500px';
    const exportLoading = this.dialog.open(ExportDataDialogComponent, config);

    const call = this.membersService
      .getMembersPage({
        vo: this.voId,
        attrNames: this.attrNames,
        query: {
          order: pageQuery.order,
          pageSize: a.length,
          offset: 0,
          sortColumn: this.membersListService.getSortColumn(pageQuery.sortColumn),
          searchString: pageQuery.searchString,
        },
      })
      .subscribe({
        next: (result) => {
          exportLoading.close();
          downloadData(
            getDataForExport(result.data, this.displayedColumns, a.getDataForColumnFun),
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

  private banMember(banForm: BanForm): void {
    this.loading = true;
    this.voService
      .setVoBan({
        banOnVo: {
          memberId: this.selection.selected[0].id,
          description: banForm.description,
          validityTo: banForm.validity,
          id: 0,
          beanName: 'BanOnVo',
        },
      })
      .subscribe({
        next: () => {
          this.notificator.showSuccess('DIALOGS.ADD_BAN.SUCCESS_MEMBER');
          this.dialogRef.close(true);
        },
        error: () => (this.loading = false),
      });
  }

  private updateBan(banForm: BanForm): void {
    this.loading = true;
    this.voService
      .updateVoBan({
        banOnVo: {
          id: this.ban.id,
          beanName: 'BanOnVo',
          voId: this.ban.voId,
          memberId: this.ban.memberId,
          description: banForm.description,
          validityTo: banForm.validity,
        },
      })
      .subscribe({
        next: () => {
          this.notificator.showSuccess('DIALOGS.UPDATE_BAN.SUCCESS');
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
