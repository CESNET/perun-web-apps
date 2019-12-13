import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveRelationDialogComponent } from './remove-relation-dialog.component';

describe('RemoveRelationDialogComponent', () => {
  let component: RemoveRelationDialogComponent;
  let fixture: ComponentFixture<RemoveRelationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveRelationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveRelationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
