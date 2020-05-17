import { Component, OnInit } from '@angular/core';
import {
  AttributesManagerService,
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
              private dialog:MatDialog,
              private attributesManagerService: AttributesManagerService) { }

  idpExtSources: RichUserExtSource[] = [];
  certExtSources: RichUserExtSource[] = [];
  otherExtSources: RichUserExtSource[] = [];
  idpSelection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>(false, []);
  certSelection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>(false, []);
  otherSelection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>(false, []);

  userId: number;
  loading: boolean;

  ngOnInit() {
    this.userId = this.storage.getPerunPrincipal().userId;
    this.refreshTables();
  }

  refreshTables(){
    this.loading = true;
    this.usersManagerService.getRichUserExtSources(this.userId).subscribe(userExtSources =>{
      let count = userExtSources.length;
      userExtSources.forEach(ues =>{
        this.attributesManagerService.getUserExtSourceAttributeByName(ues.userExtSource.id, 'urn:perun:ues:attribute-def:def:sourceIdPName').subscribe(att =>{

          if(att && att.value){
            // @ts-ignore
            ues.userExtSource.extSource.name = att.value;
            count--;
            this.loading = count !== 0;
            this.addToList(ues);
          }else {
            this.attributesManagerService.getUserExtSourceAttributeByName(ues.userExtSource.id, 'urn:perun:ues:attribute-def:def:IdPOrganizationName').subscribe(att2 =>{
              count--;
              if(att2 && att2.value){
                // @ts-ignore
                ues.userExtSource.extSource.name = att2.value;
              }
              this.loading = count !== 0;
              this.addToList(ues);
            });
          }
        });
      });
    })
  }

  addIdentity() {
    this.registrarManagerService.getConsolidatorToken().subscribe(token =>{
      const type = this.storage.getPerunPrincipal().extSourceType;
      const consolidatorBaseUrl = this.storage.get('consolidator_base_url');
      window.location.href = `${consolidatorBaseUrl}${type && type.endsWith('X509') ? 'cert' : 'fed'}-ic/ic/?target_url=${window.location.href}&token=${token}`;
    });

  }

  removeIdentity(selected: UserExtSource[]) {
    const dialogRef = this.dialog.open(RemoveUserExtSourceDialogComponent,{
      width: '600px',
      data: {
        userId: this.userId,
        extSources: selected
      },
    });
    dialogRef.afterClosed().subscribe((success) => {
      if (success){
        this.refreshTables();
      }
    })
  }

  private addToList(ues: RichUserExtSource) {
    if(ues.userExtSource.extSource.type.endsWith('Idp')){
      this.idpExtSources.push(ues)
    }
    else if(ues.userExtSource.extSource.type.endsWith('X509')){
      this.certExtSources.push(ues)
    } else {
      this.otherExtSources.push(ues)
    }
  }
}
