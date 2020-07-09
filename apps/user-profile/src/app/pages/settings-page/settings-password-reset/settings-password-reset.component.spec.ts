import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPasswordResetComponent } from './settings-password-reset.component';

describe('SettingsPasswordResetComponent', () => {
  let component: SettingsPasswordResetComponent;
  let fixture: ComponentFixture<SettingsPasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPasswordResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
