import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGroupToResourceDialogComponent } from './assign-group-to-resource-dialog.component';

describe('AssignGroupToResourceDialogComponent', () => {
  let component: AssignGroupToResourceDialogComponent;
  let fixture: ComponentFixture<AssignGroupToResourceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignGroupToResourceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignGroupToResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
