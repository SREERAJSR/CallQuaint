import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import  {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material-module/material-module.module';
import { LoginComponent } from './components/user/auth/login/login.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SignupComponent } from './components/user/auth/signup/signup.component';
import { LottifyComponent } from './components/user/lottify/lottify.component';
import { NgxUiLoaderModule,  NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from "ngx-ui-loader"
import { ngxUiLoaderConfig } from './configs/ngxconfig';
import { toasterConfig } from './configs/toasterConfig';
import {ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ForgotpasswordComponent } from './components/user/auth/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './components/user/auth/resetpassword/resetpassword.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleSigninButtonModule, } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment.development';
import { HomeComponent } from './components/user/publicpages/home/home.component';
import { ErrorpageComponent } from './components/user/publicpages/errorpage/errorpage.component';
import { NavbarComponent } from './components/user/navbar/navbar.component';
import googleLoginConfig from './configs/googleLogin.config';
import { GoogleAuthComponent } from './components/user/auth/google-auth/google-auth.component';
import { NotificationComponent } from './components/user/navbar/notification/notification.component';
import { FooterComponent } from './components/user/footer/footer.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LottifyComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    HomeComponent,
    ErrorpageComponent,
    NavbarComponent,
    GoogleAuthComponent,
    NotificationComponent,
    FooterComponent,




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    ToastrModule.forRoot(toasterConfig),
    SocialLoginModule,
    GoogleSigninButtonModule,
   
  ],
  providers: [{
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
         googleLoginConfig
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
