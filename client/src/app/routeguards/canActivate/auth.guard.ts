import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { selectUserLoginState } from 'src/app/store/auth/selectors';
import { AppState } from 'src/app/store/store';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService)
  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken()
  if (!accessToken && !refreshToken)
    return true;
  return false;

};
