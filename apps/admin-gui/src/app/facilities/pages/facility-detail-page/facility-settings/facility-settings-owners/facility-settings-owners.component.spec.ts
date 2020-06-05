import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitySettingsOwnersComponent } from './facility-settings-owners.component';

describe('FacilitySettingsOwnersComponent', () => {
  let component: FacilitySettingsOwnersComponent;
  let fixture: ComponentFixture<FacilitySettingsOwnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilitySettingsOwnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitySettingsOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
