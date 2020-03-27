import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUnixGroupDialogComponent } from './remove-unix-group-dialog.component';

describe('RemoveUnixGroupDialogComponent', () => {
  let component: RemoveUnixGroupDialogComponent;
  let fixture: ComponentFixture<RemoveUnixGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveUnixGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveUnixGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
