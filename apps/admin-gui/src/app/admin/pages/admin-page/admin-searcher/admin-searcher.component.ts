import { Component, DestroyRef, HostBinding, OnInit } from '@angular/core';
import {
  AttributeDefinition,
  AttributesManagerService,
  EnrichedFacility,
  RichMember,
  RichUser,
  SearcherService,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import {
  TABLE_SEARCHER_FACILITIES,
  TABLE_SEARCHER_MEMBERS,
  TABLE_SEARCHER_RESOURCES,
  TABLE_SEARCHER_USERS,
} from '@perun-web-apps/config/table-config';
import { ResourceWithStatus } from '@perun-web-apps/perun/models';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { compareFnName } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-admin-searcher',
  templateUrl: './admin-searcher.component.html',
  styleUrls: ['./admin-searcher.component.scss'],
})
export class AdminSearcherComponent implements OnInit {
  static id = 'AdminSearcherComponent';
  @HostBinding('class.router-component') true;
  loading: boolean;
  loadingEntityData = false;
  allAttrDefinitions: AttributeDefinition[] = [];
  searchInput: { [p: string]: string };
  tableId = TABLE_SEARCHER_USERS;
  entities: RichUser[] | RichMember[] | EnrichedFacility[] | ResourceWithStatus[] = [];
  vos: Vo[] = [];
  selectedVo: Vo;

  constructor(
    private attributesManager: AttributesManagerService,
    private searcher: SearcherService,
    private voService: VosManagerService,
    private cacheHelperService: CacheHelperService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.attributesManager.getAllAttributeDefinitions().subscribe((attrDefs) => {
      this.allAttrDefinitions = attrDefs.filter(
        (attrDef) => !attrDef.namespace.includes('-def:virt'),
      );
      this.loading = false;
    });

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === AdminSearcherComponent.id) {
          this.refresh();
        }
      });
  }

  tabChanged(indexChangeEvent: number): void {
    this.entities = [];
    switch (indexChangeEvent) {
      case 0:
        this.tableId = TABLE_SEARCHER_USERS;
        break;
      case 1:
        this.loadingEntityData = true;
        this.loadAllVos();
        this.tableId = TABLE_SEARCHER_MEMBERS;
        break;
      case 2:
        this.tableId = TABLE_SEARCHER_FACILITIES;
        break;
      case 3:
        this.tableId = TABLE_SEARCHER_RESOURCES;
        break;
      default:
        break;
    }
  }

  loadAllVos(): void {
    this.loadingEntityData = true;
    this.voService.getAllVos().subscribe((vos) => {
      this.vos = vos;
      this.vos.sort(compareFnName);
      this.selectedVo = vos[0];
      this.loadingEntityData = false;
    });
  }

  voSelected(vo: Vo): void {
    if (vo !== undefined) {
      this.selectedVo = vo;
    }
  }

  getUsers(event: { [p: string]: string }): void {
    this.searchInput = event;
    this.loadingEntityData = true;
    this.searcher
      .getUsersSearcher({
        attributesWithSearchingValues: this.searchInput,
      })
      .subscribe({
        next: (users) => {
          this.entities = users as RichUser[];
          this.loadingEntityData = false;
        },
        error: () => {
          this.loadingEntityData = false;
        },
      });
  }

  getMembers(event: { [p: string]: string }): void {
    this.searchInput = event;
    this.loadingEntityData = true;
    this.searcher
      .getMembersSearcher({
        vo: this.selectedVo.id,
        attributesWithSearchingValues: this.searchInput,
      })
      .subscribe({
        next: (members) => {
          this.entities = members as RichMember[];
          this.loadingEntityData = false;
        },
        error: () => {
          this.loadingEntityData = false;
        },
      });
  }

  getFacilities(event: { [p: string]: string }): void {
    this.searchInput = event;
    this.loadingEntityData = true;
    this.searcher
      .getFacilities({
        attributesWithSearchingValues: this.searchInput,
      })
      .subscribe({
        next: (facilities) => {
          this.entities = facilities.map((f) => ({ facility: f })) as EnrichedFacility[];
          this.loadingEntityData = false;
        },
        error: () => {
          this.loadingEntityData = false;
        },
      });
  }

  getResources(event: { [p: string]: string }): void {
    this.searchInput = event;
    this.loadingEntityData = true;
    this.searcher
      .getAttributesResources({
        attributesWithSearchingValues: this.searchInput,
      })
      .subscribe({
        next: (resources) => {
          this.entities = resources as ResourceWithStatus[];
          this.loadingEntityData = false;
        },
        error: () => {
          this.loadingEntityData = false;
        },
      });
  }

  refresh(): void {
    if (!this.searchInput) {
      return;
    }

    switch (this.tableId) {
      case TABLE_SEARCHER_USERS:
        this.getUsers(this.searchInput);
        break;
      case TABLE_SEARCHER_MEMBERS:
        this.getMembers(this.searchInput);
        break;
      case TABLE_SEARCHER_FACILITIES:
        this.getFacilities(this.searchInput);
        break;
      case TABLE_SEARCHER_RESOURCES:
        this.getResources(this.searchInput);
        break;
      default:
        break;
    }
  }
}
