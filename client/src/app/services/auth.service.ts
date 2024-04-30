import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }
  http = inject(HttpClient);
  API_URL: string = environment.api_Url;
   loggedIn :boolean =false;
  userLogin(payload: Record<string, string>) {
    return this.http.post(this.API_URL+'/user/login',payload)
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

  googleAuthenticaton(payload: SocialUser) {
    return this.http.post(this.API_URL + `/user/google`,payload)
  }

  getUserLoggedIn():boolean{
    return this.loggedIn
  }
  setUserLoggedIn(state:boolean):void{
    this.loggedIn= state;
  }

}
