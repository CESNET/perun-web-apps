import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnixGroupDialogComponent } from './add-unix-group-dialog.component';

describe('AddUnixGroupDialogComponent', () => {
  let component: AddUnixGroupDialogComponent;
  let fixture: ComponentFixture<AddUnixGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnixGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnixGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
