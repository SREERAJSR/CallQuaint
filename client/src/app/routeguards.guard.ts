import { CanActivateFn } from '@angular/router';

export const routeguardsGuard: CanActivateFn = (route, state) => {
  return true;
};
