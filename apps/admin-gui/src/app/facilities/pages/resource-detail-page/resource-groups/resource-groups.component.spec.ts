import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceGroupsComponent } from './resource-groups.component';

describe('ResourceGroupsComponent', () => {
  let component: ResourceGroupsComponent;
  let fixture: ComponentFixture<ResourceGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
