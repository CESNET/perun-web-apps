import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SshKeysListComponent } from './ssh-keys-list.component';

describe('SshKeysListComponent', () => {
  let component: SshKeysListComponent;
  let fixture: ComponentFixture<SshKeysListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SshKeysListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SshKeysListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
