import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberResourcesComponent } from './member-resources.component';

describe('MemberResourcesComponent', () => {
  let component: MemberResourcesComponent;
  let fixture: ComponentFixture<MemberResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
