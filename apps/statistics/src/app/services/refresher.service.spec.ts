import { TestBed } from '@angular/core/testing';

import { RefresherService } from './refresher.service';

describe('RefresherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefresherService = TestBed.get(RefresherService);
    expect(service).toBeTruthy();
  });
});
