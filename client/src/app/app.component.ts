import { Component, OnInit, inject } from '@angular/core';
import { AgoraService } from './services/agora.service';
import { AuthService } from './services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/store';
import { selectUserLoginState } from './store/auth/selectors';
import { changeUserStateInRefresh } from './store/auth/actions';
import { ChatService } from './services/chat.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
title='angular'
  authService: AuthService = inject(AuthService);
  store: Store<AppState> = inject(Store<AppState>)
  router:Router = inject(Router)
  userloggedInStatus: boolean = false;
  ngOnInit(): void {
    this.chatService.establishConnection()
    this.store.select(selectUserLoginState).subscribe((status) => this.userloggedInStatus = status)
    console.log(this.userloggedInStatus);
    if ((this.authService.getAccessToken() && this.authService.getRefreshToken())&& !this.userloggedInStatus) {
      let accessToken = this.authService.getAccessToken() as string;
      const payload  = {accessToken:accessToken}
      this.store.dispatch(changeUserStateInRefresh(payload))
    }
  }

  agoraService = inject(AgoraService)
  chatService = inject(ChatService)
}
