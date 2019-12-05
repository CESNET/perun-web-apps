import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsAttributesComponent } from './user-settings-attributes.component';

describe('UserAttributesComponent', () => {
  let component: UserSettingsAttributesComponent;
  let fixture: ComponentFixture<UserSettingsAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSettingsAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
