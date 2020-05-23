import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoEntityAttributePageComponent } from './two-entity-attribute-page.component';

describe('TwoEntityAttributePageComponent', () => {
  let component: TwoEntityAttributePageComponent;
  let fixture: ComponentFixture<TwoEntityAttributePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoEntityAttributePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoEntityAttributePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
