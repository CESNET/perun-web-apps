import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OneEntityAttributePageComponent } from '../../../../shared/components/one-entity-attribute-page/one-entity-attribute-page.component';
import { TwoEntityAttributePageComponent } from '../../../../shared/components/two-entity-attribute-page/two-entity-attribute-page.component';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuiAuthResolver, StoreService } from '@perun-web-apps/perun/services';
import { User } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [
    CommonModule,
    OneEntityAttributePageComponent,
    TwoEntityAttributePageComponent,
    MatTabsModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'app-user-settings-attributes',
  templateUrl: './user-attributes.component.html',
  styleUrls: ['./user-attributes.component.scss'],
})
export class UserAttributesComponent implements OnInit {
  @HostBinding('class.router-component') true;
  userId: number;
  userFacilityAttAuth: boolean;

  constructor(
    private route: ActivatedRoute,
    private store: StoreService,
    private authResolver: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.route.parent.params.subscribe((params) => {
      this.userId = Number(params['userId']);
      if (!this.userId) {
        this.userId = this.store.getPerunPrincipal().userId;
      }

      const user: User = {
        id: this.userId,
        beanName: 'User',
      };
      this.userFacilityAttAuth = this.authResolver.isAuthorized(
        'getAssignedFacilities_User_policy',
        [user],
      );
    });
  }
}
