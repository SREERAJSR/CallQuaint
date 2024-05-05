import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
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
    const authRequest = request.clone({
      headers: request.headers.set('authorization', `Bearer ${accessToken}`)
    })
    if (accessToken) {
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('error occured',error);
          if (error.status === 401) {
           return this.authService.refreshAccessToken().pipe(
             switchMap((respone: ApiResponse) => {
               this.authService.setAccessToken(respone.data.accessToken)
               this.authService.setRefreshToken(respone.data.refreshToken)
               return next.handle(authRequest)
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
