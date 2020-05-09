import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSettingsResourceAttributesComponent } from './member-settings-resource-attributes.component';

describe('MemberSettingsResourceAttributesComponent', () => {
  let component: MemberSettingsResourceAttributesComponent;
  let fixture: ComponentFixture<MemberSettingsResourceAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberSettingsResourceAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberSettingsResourceAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
