import { Component, OnInit } from '@angular/core';
import { Attribute, AttributesManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'perun-web-apps-settings-samba-password',
  templateUrl: './settings-samba-password.component.html',
  styleUrls: ['./settings-samba-password.component.scss']
})
export class SettingsSambaPasswordComponent implements OnInit {

  constructor(private attributesManagerService: AttributesManagerService,
              private store: StoreService,
              private usersManagerService:UsersManagerService) {
  }

  sambaExists: boolean;
  sambaAttribute: Attribute;
  sambaControl: FormControl;
  userId: number;

  ngOnInit() {
    this.userId = this.store.getPerunPrincipal().userId;
    this.sambaControl = new FormControl(null, [Validators.required]);
    this.getSambaAttribute();
  }

  setSambaPassword() {
    this.sambaAttribute.value = this.sambaControl.value;

    const timestamp = new Date().getTime().toString();
    this.usersManagerService.createAlternativePassword(this.userId,timestamp,'samba-du',this.sambaControl.value).subscribe(() => {
      console.log('done');
      this.sambaControl.setValue('');
      this.getSambaAttribute();
    });
  }

  getSambaAttribute(){
    this.attributesManagerService.getUserAttributeByName(this.userId, 'urn:perun:user:attribute-def:def:altPasswords:samba-du').subscribe(att => {
      console.log(att);
      this.sambaExists = !!att.value;
      this.sambaAttribute = att;
    });
  }
}
