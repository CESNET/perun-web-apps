import { Component, OnInit } from '@angular/core';
import { NewTokensServiceService } from '../../services/new-tokens-service.service';
import { Router } from '@angular/router';
import { RPCError } from '@perun-web-apps/perun/models';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-consolidate-page',
  templateUrl: './consolidate-page.component.html',
  styleUrls: ['./consolidate-page.component.scss']
})
export class ConsolidatePageComponent implements OnInit {

  constructor(
    private newTokens: NewTokensServiceService,
    private registrarManager: RegistrarManagerService,
    private router: Router
  ) { }

  error: RPCError;

  ngOnInit() {
    const token = this.newTokens.getTokens()[0];
    console.log(token);

    this.registrarManager.consolidateIdentityUsingToken(token).subscribe(ueses => {
      console.log(ueses);
      this.router.navigate(['identities']);
    }, error => this.error = error);
  }

}
