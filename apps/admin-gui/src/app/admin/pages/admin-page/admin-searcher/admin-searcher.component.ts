import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FacilitiesListComponent,
  MembersListComponent,
  ResourcesListComponent,
  UsersListComponent,
  VoSearchSelectComponent,
} from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
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
import { ResourceWithStatus } from '@perun-web-apps/perun/models';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { compareFnName } from '@perun-web-apps/perun/utils';
import { AttributeSearchSelectComponent } from '@perun-web-apps/perun/components';

@Component({
  imports: [
    CommonModule,
    MembersListComponent,
    MatTabsModule,
    MatProgressSpinnerModule,
    TranslateModule,
    AttributeSearchSelectComponent,
    UsersListComponent,
    FacilitiesListComponent,
    ResourcesListComponent,
    VoSearchSelectComponent,
  ],
  standalone: true,
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
        break;
      case 1:
        this.loadingEntityData = true;
        this.loadAllVos();
        break;
      case 2:
        break;
      case 3:
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
  }
}
