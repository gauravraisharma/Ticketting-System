import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { useradminGuard } from './useradmin.guard';

describe('useradminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => useradminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
