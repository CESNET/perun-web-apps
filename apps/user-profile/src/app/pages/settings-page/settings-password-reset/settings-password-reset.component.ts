import { Component, OnInit } from '@angular/core';
import { Attribute, AttributesManagerService} from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'perun-web-apps-settings-password-reset',
  templateUrl: './settings-password-reset.component.html',
  styleUrls: ['./settings-password-reset.component.scss']
})
export class SettingsPasswordResetComponent implements OnInit {

  userId: number;

  nameSpaces: string[] = [];
  logins: Attribute[] = [];

  displayedColumns: string[] = ['namespace', 'value', 'change'];
  dataSource: MatTableDataSource<Attribute>;

  constructor(private attributesManagerService: AttributesManagerService,
              private store: StoreService) {
  }

  ngOnInit(): void {
    this.userId = this.store.getPerunPrincipal().userId;
    this.nameSpaces = this.store.get('login_namespace_attributes');
    this.attributesManagerService.getLogins(this.userId).subscribe(logins => {
      const parsedNamespaces = this.nameSpaces.map(nameSpace => {
        const elems = nameSpace.split(':');
        return elems[elems.length - 1];
      });

      this.logins = logins.filter(login => parsedNamespaces.includes(login.friendlyNameParameter));
      this.dataSource = new MatTableDataSource<Attribute>(logins);
    });
  }

  changePassword(login: string) {
    const url = this.store.get('pwd_reset_base_url');
    location.href = `${url}?login-namespace=${login}`;
  }
}
