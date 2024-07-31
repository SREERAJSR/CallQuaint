import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../types/api.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }
  authService:AuthService = inject(AuthService);
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const accessToken = this.authService.getAccessToken();
    const refreshToken = this.authService.getRefreshToken()
    console.log(request.url);

    if (request.url ===('http://localhost:3000/api/v1/user/refreshToken') && refreshToken) {
      return next.handle(request);
    }

    const authRequest = request.clone({
      headers: request.headers.set('authorization', `Bearer ${accessToken}`)
    })
    if (accessToken) {
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('error occured',error);
          if (error.status === 401) {

           return this.authService.refreshAccessToken().pipe(
             switchMap((response: ApiResponse) => {
               this.authService.setAccessToken(response.data.accessToken)
               const newAuthRequest = request.clone({
                headers: request.headers.set('authorization', `Bearer ${response.data.accessToken}`)
               })
               return next.handle(newAuthRequest)
             }),
             catchError((refreshToken) => {
               this.authService.removeAccessToken()
               this.authService.removeRefreshToken();
               this.authService.userLogout();
               return throwError(()=> refreshToken)
             })
            )
          }
          return throwError(()=> error)
        })
      )
    }
    return next.handle(request)
  }
}
  