import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveGroupResourceDialogComponent } from './remove-group-resource-dialog.component';

describe('RemoveGroupResourceDialogComponent', () => {
  let component: RemoveGroupResourceDialogComponent;
  let fixture: ComponentFixture<RemoveGroupResourceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveGroupResourceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveGroupResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
