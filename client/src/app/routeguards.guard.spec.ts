import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { routeguardsGuard } from './routeguards.guard';

describe('routeguardsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => routeguardsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
