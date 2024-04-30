import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.css']
})
export class GoogleAuthComponent implements OnInit, OnDestroy {


  ngOnInit(): void {
  
    if (!this.authService.getUserLoggedIn()) {
      this.socialLoginSubscription = this.socialAuthService.authState.subscribe((user: SocialUser): void => {
        this.user = user;
        this.loggedIn = (user != null);
        this.loggedIn = true;
        this.authService.setUserLoggedIn(true)
        if (user) {
          this.googleSubscription = this.authService.googleAuthenticaton(user).subscribe({
            next: (response: any) => {
              if (response.statusCode === 200) {
                localStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshAccessToken)
                this.toastr.success(response.message)
                this.loggedIn = true;
                this.router.navigate(['/'])
              }
            },
            error: (error) => {
           const err = error.error.errorMessage;
            this.toastr.error(err)
            }
          },)

        } else {
          this.toastr.error("Google authentication failed")
        }
      });
    }
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
