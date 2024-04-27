import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }
  http = inject(HttpClient);
  API_URL: string = environment.api_Url;

  userLogin(payload: Record<string, string>) {
    return this.http.post(this.API_URL+'/user/login',payload)
  }

  userSignup(payload: Record<string, string>) {
    return this.http.post(this.API_URL+'/user/signup',payload)
  }

    verifyEmail(token: string){
      return this.http.get(this.API_URL+`/user/verify/${token}`)
    }
}
