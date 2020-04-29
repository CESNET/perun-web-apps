import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSSHKeysComponent } from './settings-ssh-keys.component';

describe('SettingsSSHKeysComponent', () => {
  let component: SettingsSSHKeysComponent;
  let fixture: ComponentFixture<SettingsSSHKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsSSHKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSSHKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
