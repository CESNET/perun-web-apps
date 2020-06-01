import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSettingsGroupAttributesComponent } from './member-settings-group-attributes.component';

describe('MemberSettingsGroupAttributesComponent', () => {
  let component: MemberSettingsGroupAttributesComponent;
  let fixture: ComponentFixture<MemberSettingsGroupAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberSettingsGroupAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberSettingsGroupAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
