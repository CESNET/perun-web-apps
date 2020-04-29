import { TestBed } from '@angular/core/testing';

import { UserProfileConfigService } from './user-profile-config.service';

describe('UserProfileConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserProfileConfigService = TestBed.get(UserProfileConfigService);
    expect(service).toBeTruthy();
  });
});
