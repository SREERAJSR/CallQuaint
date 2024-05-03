import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
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
      this.store.select(selectUserLoginState).subscribe((status) => {
        if (!status) {
         this.socialLoginSubscription = this.socialAuthService.authState.subscribe((user: SocialUser): void => {
        this.user = user;
           if (user) {
             this.store.dispatch(googleLoginAction({ user }))        
        } else {
          this.toastr.error("Google authentication failed")
        }
      });
      }
    })

  }
  
  
  socialUser!: SocialUser;
  public user: SocialUser = new SocialUser();
  loggedIn?: boolean = false
  accessToken: any
  authService: AuthService = inject(AuthService)
  socialAuthService: SocialAuthService = inject(SocialAuthService);
  router: Router = inject(Router)
  toastr: ToastrService = inject(ToastrService)
  hide: boolean = true;
  private userLoginSubscription?: Subscription;
  socialLoginSubscription?: Subscription;
  googleSubscription?: Subscription


  ngOnDestroy(): void {
 
    this.googleSubscription?.unsubscribe()
    console.log(this.socialLoginSubscription, 'ddsd')
  }

}
