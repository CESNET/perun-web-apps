import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupResourceDialogComponent } from './add-group-resource-dialog.component';

describe('AddGroupResourceDialogComponent', () => {
  let component: AddGroupResourceDialogComponent;
  let fixture: ComponentFixture<AddGroupResourceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGroupResourceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
