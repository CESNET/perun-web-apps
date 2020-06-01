import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsFacilityAttributesComponent } from './user-settings-facility-attributes.component';

describe('UserSettingsFacilityAttributesComponent', () => {
  let component: UserSettingsFacilityAttributesComponent;
  let fixture: ComponentFixture<UserSettingsFacilityAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSettingsFacilityAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsFacilityAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
