import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import  {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material-module/material-module.module';
import { LoginComponent } from './components/user/login/login.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SignupComponent } from './components/user/signup/signup.component';
import { LottifyComponent } from './components/lottify/lottify.component';
import { NgxUiLoaderModule, NgxUiLoaderConfig, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from "ngx-ui-loader"

const ngxUiLoaderConfig: NgxUiLoaderConfig  =
{
  "bgsColor": "#7252b9",
  "bgsOpacity": 0.7,
  "bgsPosition": "bottom-right",
  "bgsSize": 70,
  "bgsType": "cube-grid",
  "blur": 0,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#7252b9",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "square-jelly-box",
  "gap": 27,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": '',
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(0,0,0,0.13)",
  "pbColor": "#7252b9",
  "pbDirection": "ltr",
  "pbThickness": 2,
  "hasProgressBar": true,
  "text": "Loading...",
  "textColor": "#222222",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 300
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LottifyComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule
  ],
  providers: [],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
