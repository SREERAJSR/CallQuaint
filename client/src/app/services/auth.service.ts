import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ApiError, ApiResponse } from '../types/api.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }
  http = inject(HttpClient);
  API_URL: string = environment.api_Url;
  loggedIn: boolean = false;
  

  userLogin(payload: Record<string, string>){
    return this.http.post <ApiResponse>(this.API_URL + '/user/login', payload).pipe(
      catchError((error: HttpErrorResponse) => {
        const err = {
          message: error?.error?.errorMessage,
          statusCode:error.status
        } 
        return throwError(()=>err)
      })
    )
  }

  userSignup(payload: Record<string, string>) {
    return this.http.post(this.API_URL+'/user/signup',payload)
  }

    verifyEmail(token: string){
      return this.http.get(this.API_URL+`/user/verify/${token}`)
    }

  forgotPasswordRequest(payload: Record<string, string>) {
    return this.http.post(this.API_URL+`/user/forgot-password`,payload)
  }

  resetPasswordRequest(payload: Record<string, string>, token: string) {
    return this.http.post(this.API_URL+`/user/reset-password/${token}`, payload);
  }

  googleAuthenticaton(payload: SocialUser):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.API_URL + `/user/google`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
           const err = {
          message: error?.error?.errorMessage,
             statusCode: error.status
          
        } 
        return throwError(()=> err)
      })
    )
  }

  getUserLoggedIn():boolean{
    return this.loggedIn
  }
  setUserLoggedIn(state:boolean):void{
    this.loggedIn= state;
  }

  removeAccessToken(): void{
    window.localStorage.removeItem('accessToken')
  }
  getAccessToken() {
    return window.localStorage.getItem('accessToken')
  }
  setAccessToken(token: string) {
    window.localStorage.setItem('accessToken',token)
  }
  setRefreshToken( token: string) {
    window.localStorage.setItem('refreshToken',token)
  }
    getRefreshToken() {
      return window.localStorage.getItem('refreshToken')
    }
    removeRefreshToken(): void{
    window.localStorage.removeItem('refreshToken')
  }

}
