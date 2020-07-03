import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberToResourceComponent } from './add-member-to-resource.component';

describe('AddMemberToResourceComponent', () => {
  let component: AddMemberToResourceComponent;
  let fixture: ComponentFixture<AddMemberToResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberToResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberToResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
