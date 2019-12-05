import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoSelectTableComponent } from './vo-select-table.component';

describe('VoSelectTableComponent', () => {
  let component: VoSelectTableComponent;
  let fixture: ComponentFixture<VoSelectTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoSelectTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoSelectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
