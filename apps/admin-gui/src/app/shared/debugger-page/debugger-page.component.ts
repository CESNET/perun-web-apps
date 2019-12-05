import { Component, OnInit } from '@angular/core';
import {AuthResolverService} from '../../core/services/common/auth-resolver.service';
import { PerunPrincipal } from '@perun-web-apps/perun/models';
import { StoreService } from '../../core/services/common/store.service';

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
