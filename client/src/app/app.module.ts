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
import { LottifyComponent } from './components/lottify/lottify.component';
import { NgxUiLoaderModule,  NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from "ngx-ui-loader"
import { ngxUiLoaderConfig } from './configs/ngxconfig';
import { toasterConfig } from './configs/toasterConfig';
import { GlobalConfig, ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ForgotpasswordComponent } from './components/user/auth/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './components/user/auth/resetpassword/resetpassword.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleInitOptions } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login'; 
import { environment } from 'src/environments/environment.development';
import { HomeComponent } from './components/user/publicpages/home/home.component';
const googleLoginOptions: GoogleInitOptions = {
  oneTapEnabled: false, // default is true
  scopes: ['profile', 'email']
}; 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LottifyComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    HomeComponent
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
    SocialLoginModule
  ],
  providers: [{
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID)
          },
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
