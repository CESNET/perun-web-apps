import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPreferredShellsComponent } from './settings-preferred-shells.component';

describe('SettingsPreferredShellsComponent', () => {
  let component: SettingsPreferredShellsComponent;
  let fixture: ComponentFixture<SettingsPreferredShellsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPreferredShellsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPreferredShellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
