import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSettingsRelationsComponent } from './group-settings-relations.component';

describe('GroupSettingsRelationsComponent', () => {
  let component: GroupSettingsRelationsComponent;
  let fixture: ComponentFixture<GroupSettingsRelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSettingsRelationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSettingsRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
