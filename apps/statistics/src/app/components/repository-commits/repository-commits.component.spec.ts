import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryCommitsComponent } from './repository-commits.component';

describe('RepositoryCommitsComponent', () => {
  let component: RepositoryCommitsComponent;
  let fixture: ComponentFixture<RepositoryCommitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepositoryCommitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryCommitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
