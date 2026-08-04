import { DataSource } from '@angular/cdk/collections';
import {
  MemberGroupStatus,
  MembersOrderColumn,
  PaginatedRichMembers,
  RichMember,
  SortingOrder,
  VoMemberStatuses,
} from '@perun-web-apps/perun/openapi';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DynamicPaginatingService } from './dynamic-paginating.service';
import { GuiAuthResolver } from './gui-auth-resolver.service';
import { MatTableDataSource } from '@angular/material/table';
import { DynamicDataSource as NewDynamicDataSource } from '@perun-web-apps/perun/models';

export function isPaginatedDataSource<T>(
  ds: MatTableDataSource<T> | DynamicDataSource<T> | NewDynamicDataSource<T>,
): ds is DynamicDataSource<T> {
  return 'allObjectCount' in ds;
}

export class DynamicDataSource<T> implements DataSource<T> {
  loading$: Observable<boolean>;
  allObjectCount = 0;
  routeAuth = true;
  step = 10000;
  private latestQueryTime: number;
  private dataSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private dynamicPaginatingService: DynamicPaginatingService,
    private authzService: GuiAuthResolver,
  ) {
    this.loading$ = this.loadingSubject.asObservable();
  }

  loadMembers(
    voId: number,
    attrNames: string[],
    sortOrder: SortingOrder,
    pageIndex: number,
    pageSize: number,
    sortColumn: MembersOrderColumn,
    statuses: VoMemberStatuses[],
    searchString?: string,
    groupId?: number,
    groupStatuses?: MemberGroupStatus[],
  ): void {
    this.loadingSubject.next(true);
    this.latestQueryTime = Date.now();
    const thisQueryTime = this.latestQueryTime;

    this.dynamicPaginatingService
      .getMembers(
        voId,
        attrNames,
        sortOrder,
        pageIndex,
        pageSize,
        sortColumn,
        statuses,
        searchString,
        groupId,
        groupStatuses,
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe((paginatedRichMembers) => {
        if (this.latestQueryTime <= thisQueryTime) {
          const data: RichMember[] = (paginatedRichMembers as PaginatedRichMembers).data;
          if (data !== null && data.length !== 0) {
            this.routeAuth = this.authzService.isAuthorized('getMemberById_int_policy', [
              { beanName: 'Vo', id: voId },
              data[0],
            ]);
          }
          this.allObjectCount = (paginatedRichMembers as PaginatedRichMembers).totalCount;
          this.dataSubject.next(data as unknown as T[]);
        }
      });
  }
  connect(): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  getData(): T[] {
    return this.dataSubject.value;
  }
}
