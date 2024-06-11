import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { jwtDecode } from 'jwt-decode';
import { AgoraService } from 'src/app/services/agora.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { AcceptCallPayload, IVideoCallSocketEventPayload } from 'src/app/types/chat.interface';

@Component({
  selector: 'app-incoming-call-request',
  templateUrl: './incoming-call-request.component.html',
  styleUrls: ['./incoming-call-request.component.css']
})
export class IncomingCallRequestComponent {
 
  incomingCallRequest: AcceptCallPayload | null = null;
  constructor(private chatService: ChatService,
    private agoraService: AgoraService,
    private authService: AuthService) {
    
    this.chatService.incomingCall$.subscribe({
      next: (call: AcceptCallPayload | null) => {
        this.incomingCallRequest = call
      }
    } 
    )
  
  }
  _id?: string
  name?:string
  async acceptCall() {
   
 const accessToken = this.authService.getAccessToken();
   const { _id, gender, firstname } = this.authService.decodeJwtPayload(accessToken as string)
    const payload: AcceptCallPayload = {
      callerName: firstname,
      channelName: this.incomingCallRequest?.channelName!,
      uid: _id
    } 
    console.log(payload);
     this.incomingCallRequest = null;
    await this.agoraService.acceptCall(payload)
   
  }

  async declineCall() {
    await this.agoraService.leaveVideoCall()
    this.incomingCallRequest =null
}
  }
  


