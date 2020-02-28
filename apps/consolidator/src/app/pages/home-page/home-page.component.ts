import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddIdentityDialogComponent } from '../../components/add-identity-dialog/add-identity-dialog.component';
import { RegistrarService} from '@perun-web-apps/perun/services';
import { Identity } from '../../models/Identity';
import { AuthzResolverService, UsersManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private usersService: UsersManagerService,
    private authzService: AuthzResolverService,
    private registrarService: RegistrarService
  ) { }

  knownIdentities: Identity[];

  unknownIdentities: Identity[];

  perunIdentitiesLoaded = true;
  newIdentitiesLoaded = false;

  ngOnInit() {
    this.registrarService.getConsolidatorToken().subscribe(token => console.log(token));

    this.authzService.getPerunPrincipal().subscribe(principal => {
      this.usersService.getRichUserExtSources(principal.userId).subscribe(userExtSources => {
        this.knownIdentities = userExtSources.map(rues => ({
          login: rues.userExtSource.login,
          rues: rues
        }));
      });
    });
  }

  addIdentity() {
    const dialogRef = this.dialog.open(AddIdentityDialogComponent, {width: '700px'});

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    })
  }
}
