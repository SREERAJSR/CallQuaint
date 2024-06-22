import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService)
  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken()
  if (!accessToken && !refreshToken)
    return true;
  return false;

};
