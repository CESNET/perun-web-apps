import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAlternativePasswordsComponent } from './settings-alternative-passwords.component';

describe('SettingsAlternativePasswordsComponent', () => {
  let component: SettingsAlternativePasswordsComponent;
  let fixture: ComponentFixture<SettingsAlternativePasswordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsAlternativePasswordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsAlternativePasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
