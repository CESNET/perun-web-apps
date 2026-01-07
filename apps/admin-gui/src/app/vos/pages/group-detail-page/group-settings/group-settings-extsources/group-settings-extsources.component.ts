import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ExtSource, ExtSourcesManagerService, Group } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import {
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
} from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddExtSourceDialogComponent } from '../../../../../shared/components/dialogs/add-ext-source-dialog/add-ext-source-dialog.component';
import { RemoveExtSourceDialogComponent } from '../../../../../shared/components/dialogs/remove-ext-source-dialog/remove-ext-source-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { ExtSourcesListComponent } from '../../../../../shared/components/ext-sources-list/ext-sources-list.component';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    LoaderDirective,
    ExtSourcesListComponent,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-group-settings-extsources',
  templateUrl: './group-settings-extsources.component.html',
  styleUrls: ['./group-settings-extsources.component.scss'],
})
export class GroupSettingsExtsourcesComponent implements OnInit {
  group: Group;
  extSources: ExtSource[] = [];
  selection = new SelectionModel<ExtSource>(true, []);
  cachedSubject = new BehaviorSubject(true);
  loading: boolean;
  filterValue = '';
  successMessage: string;
  displayedColumns: string[] = [];
  addAuth: boolean;
  removeAuth: boolean;

  constructor(
    private extSourceService: ExtSourcesManagerService,
    private dialog: MatDialog,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private authResolver: GuiAuthResolver,
    private entityStorageService: EntityStorageService,
  ) {
    this.translate
      .get('GROUP_DETAIL.SETTINGS.EXT_SOURCES.SUCCESS_REMOVED')
      .subscribe((result: string) => (this.successMessage = result));
  }

  ngOnInit(): void {
    this.group = this.entityStorageService.getEntity();
    this.setAuthRights();
    this.refreshTable();
  }

  setAuthRights(): void {
    this.addAuth = this.authResolver.isAuthorized('addExtSource_Group_ExtSource_policy', [
      this.group,
    ]);
    this.removeAuth = this.authResolver.isAuthorized('removeExtSource_Group_ExtSource_policy', [
      this.group,
    ]);
    this.displayedColumns = this.removeAuth
      ? ['select', 'id', 'name', 'type']
      : ['id', 'name', 'type'];
  }

  refreshTable(): void {
    this.loading = true;
    this.extSourceService.getGroupExtSources(this.group.id).subscribe((sources) => {
      this.extSources = sources;
      this.selection.clear();
      this.cachedSubject.next(true);
      this.loading = false;
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  onAdd(): void {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = {
      voId: this.group.voId,
      groupId: this.group.id,
      extSources: this.extSources,
      theme: 'group-theme',
    };

    const dialogRef = this.dialog.open(AddExtSourceDialogComponent, config);
    dialogRef.afterClosed().subscribe((added) => {
      if (added) {
        this.refreshTable();
      }
    });
  }

  onRemove(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      voId: this.group.voId,
      groupId: this.group.id,
      extSources: this.selection.selected,
      theme: 'group-theme',
    };

    const dialogRef = this.dialog.open(RemoveExtSourceDialogComponent, config);
    dialogRef.afterClosed().subscribe((removed) => {
      if (removed) {
        this.refreshTable();
      }
    });
  }
}
