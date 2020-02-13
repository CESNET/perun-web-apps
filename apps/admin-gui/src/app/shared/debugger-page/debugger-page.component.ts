import { Component, OnInit } from '@angular/core';
import {AuthResolverService} from '@perun-web-apps/perun/services';
import { PerunPrincipal } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-debugger-page',
  templateUrl: './debugger-page.component.html',
  styleUrls: ['./debugger-page.component.scss']
})
export class DebuggerPageComponent implements OnInit {

  constructor(
    public authResolver: AuthResolverService,
    private store: StoreService
  ) { }

  principal: PerunPrincipal;

  ngOnInit() {
    this.principal = this.store.getPerunPrincipal();
  }
}
