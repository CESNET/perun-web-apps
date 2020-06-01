import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSettingsResourceAttributesComponent } from './group-settings-resource-attributes.component';

describe('GroupSettingsResourceAttributesComponent', () => {
  let component: GroupSettingsResourceAttributesComponent;
  let fixture: ComponentFixture<GroupSettingsResourceAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSettingsResourceAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSettingsResourceAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
