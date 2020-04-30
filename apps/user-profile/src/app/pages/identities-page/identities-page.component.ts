import { Component, OnInit } from '@angular/core';
import {
  RegistrarManagerService,
  RichUserExtSource,
  UserExtSource,
  UsersManagerService
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { StoreService } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { RemoveUserExtSourceDialogComponent } from '../../components/dialogs/remove-user-ext-source-dialog/remove-user-ext-source-dialog.component';

@Component({
  selector: 'perun-web-apps-identities-page',
  templateUrl: './identities-page.component.html',
  styleUrls: ['./identities-page.component.scss']
})
export class IdentitiesPageComponent implements OnInit {

  constructor(private usersManagerService: UsersManagerService,
              private storage: StoreService,
              private registrarManagerService: RegistrarManagerService,
              private dialog:MatDialog) { }

  userExtSources: RichUserExtSource[] = [];
  selection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>(false, []);
  userId: number;

  ngOnInit() {
    this.userId = this.storage.getPerunPrincipal().userId;
    this.usersManagerService.getRichUserExtSources(this.userId).subscribe(userExtSources =>{
      this.userExtSources = userExtSources;
    })
  }

  addIdentity() {
    this.registrarManagerService.getConsolidatorToken().subscribe(token =>{
      const type = this.storage.getPerunPrincipal().extSourceType;
      const consolidatorBaseUrl = this.storage.get('consolidator_base_url');
      window.location.href = `${consolidatorBaseUrl}${type && type.endsWith('X509') ? 'cert' : 'fed'}-ic/ic/?target_url=${window.location.href}&token=${token}`;
    });

  }

  removeIdentity() {
    const dialogRef = this.dialog.open(RemoveUserExtSourceDialogComponent,{
      width: '600px',
      data: {
        extSources: this.selection.selected
      },

    });
  }
}
