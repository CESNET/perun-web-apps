import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentitiesPageComponent } from './identities-page.component';

describe('IdentitiesPageComponent', () => {
  let component: IdentitiesPageComponent;
  let fixture: ComponentFixture<IdentitiesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentitiesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentitiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
