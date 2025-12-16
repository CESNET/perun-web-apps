import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Attribute,
  AttributesManagerService,
  UserExtSource,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { filterCoreAttributes, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AttributesListComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { DeleteAttributeDialogComponent } from '../dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { EditAttributeDialogComponent } from '@perun-web-apps/perun/dialogs';
import { CreateAttributeDialogComponent } from '../dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    RefreshButtonComponent,
    TranslateModule,
    AttributesListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-identity-detail',
  templateUrl: './identity-detail.component.html',
  styleUrls: ['./identity-detail.component.scss'],
})
export class IdentityDetailComponent implements OnInit {
  @ViewChild('list')
  list: AttributesListComponent;
  loading = false;
  selection = new SelectionModel<Attribute>(
    true,
    [],
    true,
    (attribute1, attribute2) => attribute1.id === attribute2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  attributes: Attribute[] = [];
  userExtSource: UserExtSource;

  constructor(
    private dialog: MatDialog,
    private attributesManager: AttributesManagerService,
    private userService: UsersManagerService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const identityId = Number(params['identityId']);
      this.userService.getUserExtSourceById(identityId).subscribe((extSource) => {
        this.userExtSource = extSource;
        this.refreshTable();
      });
    });
  }

  refreshTable(): void {
    this.loading = true;
    this.attributesManager
      .getUserExtSourceAttributes(this.userExtSource.id)
      .subscribe((attributes) => {
        this.attributes = filterCoreAttributes(attributes);
        this.selection.clear();
        this.cachedSubject.next(true);
        this.loading = false;
      });
  }

  onAdd(): void {
    const config = getDefaultDialogConfig();
    config.width = '1050px';
    config.data = {
      entityId: this.userExtSource.id,
      entity: 'ues',
      notEmptyAttributes: this.attributes,
      style: 'user-theme',
    };

    const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'saved') {
        this.refreshTable();
      }
    });
  }

  onSave(): void {
    this.list.updateMapAttributes();

    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      entityId: this.userExtSource.id,
      entity: 'ues',
      attributes: this.selection.selected,
    };

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onRemove(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      entityId: this.userExtSource.id,
      entity: 'ues',
      attributes: this.selection.selected,
    };

    const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }
}
