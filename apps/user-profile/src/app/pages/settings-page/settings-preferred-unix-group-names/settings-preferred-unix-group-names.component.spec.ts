import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPreferredUnixGroupNamesComponent } from './settings-preferred-unix-group-names.component';

describe('SettingsPreferredUnixGroupNamesComponent', () => {
  let component: SettingsPreferredUnixGroupNamesComponent;
  let fixture: ComponentFixture<SettingsPreferredUnixGroupNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPreferredUnixGroupNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPreferredUnixGroupNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
