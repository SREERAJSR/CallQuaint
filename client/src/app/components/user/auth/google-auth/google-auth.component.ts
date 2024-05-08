import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import { googleLoginAction } from 'src/app/store/auth/actions';
import { selectUserLoginState } from 'src/app/store/auth/selectors';
import { AppState } from 'src/app/store/store';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.css']
})
export class GoogleAuthComponent implements OnInit, OnDestroy {

  store = inject(Store<AppState>);
  ngOnInit(): void {
    if (!this.authService.getUserLoggedIn()) {
   this.socialLoginSubscription$=   this.socialAuthService.authState.subscribe({
        next: (user) => {
           this.authService.setUserLoggedIn(true)
           this.store.dispatch(googleLoginAction({ user }))
         }, error: (error) => {
           console.log(error);
           this.toastr.error("Google authentication failed")
      }
    })
    }
  }
  select!:Subscription
  user: SocialUser | null = null;
  loggedIn?: boolean;
  googleLogin?:boolean
  socialLoginSubscription$!: Subscription;
  socialAuthService: SocialAuthService = inject(SocialAuthService);
  authService:AuthService = inject(AuthService)
  router: Router = inject(Router)
  toastr: ToastrService = inject(ToastrService)
  hide: boolean = true;

    refreshToken() {
    return this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
    }

  ngOnDestroy(): void {

// this.socialLoginSubscription$.unsubscribe()
  }

}
