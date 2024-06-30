import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError,  throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import {  ApiResponse } from '../types/api.interface';
import {jwtDecode} from 'jwt-decode';
import { JwtPayload } from '../types/jwt.interface';
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

  userLogout() {
    return this.http.post<ApiResponse>(this.API_URL+'/user/logout',{})
  }

    verifyEmail(token: string){
      return this.http.get(this.API_URL+`/user/verify/${token}`)
    }

  forgotPasswordRequest(payload: Record<string, string>) {
    return this.http.post<ApiResponse>(this.API_URL+`/user/forgot-password`,payload)
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
  refreshAccessToken() {
    const incomingRefreshToken = this.getRefreshToken()
    return this.http.post<ApiResponse>(this.API_URL+`/user/refreshToken`,{incomingRefreshToken:incomingRefreshToken})
  }


  getUserInfo() {
      return this.http.get<ApiResponse>(this.API_URL+`/user/user-info`)
  }

  editProfile(payload:any) {
    return this.http.patch<ApiResponse>(this.API_URL+`/user/edit-profile`,payload)
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
  
  setGenderForGoogleAuthUsers(gender:{gender:string}) {
    return this.http.post<ApiResponse>(this.API_URL+'/user/setgender',gender)
  }

    decodeJwtPayload(accessToken: string) {
      const decoded = jwtDecode<JwtPayload>(accessToken)
    return decoded
  }
  
//Admin

    setAdminAccessToken(token: string) {
    window.localStorage.setItem('adminAccessToken',token)
  }
   setAdminRefreshToken( token: string) {
    window.localStorage.setItem('adminRefreshToken',token)
   }
    getAdminAccessToken() {
    return window.localStorage.getItem('adminAccessToken')
  }
    getAdminRefreshToken() {
      return window.localStorage.getItem('adminRefreshToken')
    }
    removeAdminAccessToken(): void{
    window.localStorage.removeItem('adminAccessToken')
  }
      removeAdminRefreshToken(): void{
    window.localStorage.removeItem('adminRefreshToken')
      }
  
  getCurrentSubscriptionDetails() {
    return this.http.get<ApiResponse>(this.API_URL+'/user/current-plan')
  }
}
