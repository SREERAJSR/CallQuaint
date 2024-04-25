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
import { NgxUiLoaderModule,  NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from "ngx-ui-loader"
import { ngxUiLoaderConfig } from './configs/ngxconfig';
import { ToastrModule } from 'ngx-toastr';




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
    NgxUiLoaderRouterModule,
    ToastrModule.forRoot({timeOut: 800,
    positionClass: 'toast-top-right',
      preventDuplicates: true,progressAnimation:'increasing',closeButton:true}),
  ],
  providers: [],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
