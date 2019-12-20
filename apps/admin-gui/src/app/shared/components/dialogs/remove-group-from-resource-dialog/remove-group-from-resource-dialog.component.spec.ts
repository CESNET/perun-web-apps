import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveGroupFromResourceDialogComponent } from './remove-group-from-resource-dialog.component';

describe('RemoveGroupFromResourceDialogComponent', () => {
  let component: RemoveGroupFromResourceDialogComponent;
  let fixture: ComponentFixture<RemoveGroupFromResourceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveGroupFromResourceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveGroupFromResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
