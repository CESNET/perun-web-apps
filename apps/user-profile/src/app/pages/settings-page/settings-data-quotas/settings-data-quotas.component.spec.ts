import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDataQuotasComponent } from './settings-data-quotas.component';

describe('SettingsDataQuotasComponent', () => {
  let component: SettingsDataQuotasComponent;
  let fixture: ComponentFixture<SettingsDataQuotasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsDataQuotasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDataQuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
