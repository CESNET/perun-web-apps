import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeValueIntegerComponent } from './attribute-value-integer.component';

describe('AttributeValueIntegerComponent', () => {
  let component: AttributeValueIntegerComponent;
  let fixture: ComponentFixture<AttributeValueIntegerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeValueIntegerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeValueIntegerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
