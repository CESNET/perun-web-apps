import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSambaPasswordComponent } from './settings-samba-password.component';

describe('SettingsSambaPasswordComponent', () => {
  let component: SettingsSambaPasswordComponent;
  let fixture: ComponentFixture<SettingsSambaPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsSambaPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSambaPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
