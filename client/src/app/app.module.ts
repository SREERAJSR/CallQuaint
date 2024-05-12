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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConnectComponent } from './components/privatepages/connect/connect.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth/reducers';
import { appEffects } from './store/auth/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FriendsComponent } from './components/privatepages/connect/friends/friends.component';
import { RequestsComponent } from './components/privatepages/connect/requests/requests.component';
import { CallsAndHistoryComponent } from './components/privatepages/connect/calls-and-history/calls-and-history.component';
import { CallSetupComponent } from './components/privatepages/connect/call-setup/call-setup.component';
import { CallingscreenComponent } from './components/privatepages/connect/call-setup/callingscreen/callingscreen.component';
import { SelectGenderComponent } from './components/user/publicpages/home/select-gender/select-gender.component';









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
    ConfirmDialogComponent,
    ConnectComponent,
    FriendsComponent,
    RequestsComponent,
    CallsAndHistoryComponent,
    CallSetupComponent,
    CallingscreenComponent,
    SelectGenderComponent,
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
    EffectsModule.forRoot([appEffects]),
    StoreModule.forRoot({ auth: authReducer }),
   StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    })
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
  },
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
