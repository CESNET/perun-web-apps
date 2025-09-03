import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  DebounceFilterComponent,
  GroupsListComponent,
  RefreshButtonComponent,
} from '@perun-web-apps/perun/components';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { CreateRelationDialogComponent } from '../../../../../shared/components/dialogs/create-relation-dialog/create-relation-dialog.component';
import { RemoveRelationDialogComponent } from '../../../../../shared/components/dialogs/remove-relation-dialog/remove-relation-dialog.component';
import { TABLE_GROUP_SETTINGS_RELATIONS } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CacheHelperService } from '../../../../../core/services/common/cache-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    MatTooltip,
    GroupsListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-group-settings-relations',
  templateUrl: './group-settings-relations.component.html',
  styleUrls: ['./group-settings-relations.component.scss'],
})
export class GroupSettingsRelationsComponent implements OnInit {
  static id = 'GroupSettingsRelationsComponent';

  @HostBinding('class.router-component') true;

  selection: SelectionModel<Group> = new SelectionModel<Group>(
    true,
    [],
    true,
    (group1, group2) => group1.id === group2.id,
  );
  groups: Group[] = [];
  group: Group;
  reverse = false;
  loading: boolean;
  filterValue = '';
  tableId = TABLE_GROUP_SETTINGS_RELATIONS;
  removeAuth$: Observable<boolean> = this.selection.changed.pipe(
    map((changed) => {
      return changed.source.selected.reduce(
        (acc, grp) =>
          acc &&
          this.authResolver.isAuthorized('result-removeGroupUnion_Group_Group_policy', [
            { id: this.group.id, beanName: 'Group', voId: this.group.voId } as Group,
          ]) &&
          this.authResolver.isAuthorized('operand-removeGroupUnion_Group_Group_policy', [grp]),
        true,
      );
    }),
  );
  cacheSubject = new BehaviorSubject(true);

  constructor(
    private groupService: GroupsManagerService,
    private dialog: MatDialog,
    private entityStorageService: EntityStorageService,
    private authResolver: GuiAuthResolver,
    private cacheHelperService: CacheHelperService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.group = this.entityStorageService.getEntity();
    this.refreshTable();
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === GroupSettingsRelationsComponent.id) {
          this.refreshTable();
        }
      });
  }

  onCreate(): void {
    const config = getDefaultDialogConfig();
    config.width = '1050px';
    config.data = {
      groups: this.groups,
      theme: 'group-theme',
      group: this.group,
      voId: this.group.voId,
      reverse: this.reverse,
    };

    const dialogRef = this.dialog.open(CreateRelationDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onDelete(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      groups: this.selection.selected,
      theme: 'group-theme',
      groupId: this.group.id,
      reverse: this.reverse,
    };

    const dialogRef = this.dialog.open(RemoveRelationDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  refreshTable(): void {
    this.loading = true;
    this.cacheSubject.next(true);
    this.selection.clear();
    this.groupService.getGroupUnions(this.group.id, this.reverse).subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.selection.clear();
  }

  showReverseUnions(): void {
    this.reverse = !this.reverse;
    this.refreshTable();
  }
}
