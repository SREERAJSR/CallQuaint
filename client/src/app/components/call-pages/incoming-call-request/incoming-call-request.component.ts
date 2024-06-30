import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgoraService } from 'src/app/services/agora.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { AcceptCallPayload } from 'src/app/types/chat.interface';

@Component({
  selector: 'app-incoming-call-request',
  templateUrl: './incoming-call-request.component.html',
  styleUrls: ['./incoming-call-request.component.css']
})
export class IncomingCallRequestComponent implements OnDestroy {
 
  callType?:string
  incomingCallRequest: AcceptCallPayload | null = null;
  incomingCallSubscription?:Subscription
  constructor(private chatService: ChatService,
    private agoraService: AgoraService,
    private authService: AuthService) {
this.incomingCallSubscription=  this.chatService.incomingCall$.subscribe({
      next: (call: AcceptCallPayload | null) => {
        this.incomingCallRequest = call
        this.callType =call?.callType
      }
    } 
    )
  
  }


audioSrc :string ='assets/audio/Vlog Background Music Ringtone.mp3'
  _id?: string
  name?:string
  async acceptVideoCall() {
 const accessToken = this.authService.getAccessToken();
   const { _id, gender, firstname } = this.authService.decodeJwtPayload(accessToken as string)
    const payload: AcceptCallPayload = {
      callerName: firstname,
      channelName: this.incomingCallRequest?.channelName!,
      uid: _id
    } 
     this.incomingCallRequest = null;
    await this.agoraService.acceptCall(payload)
    this.agoraService.openVideoContainer$.next(true)
   
  }

  acceptVoiceCall() {
     const accessToken = this.authService.getAccessToken();
    const { _id, gender, firstname } = this.authService.decodeJwtPayload(accessToken as string)
     const customUid = _id+' '+firstname+' '+gender;
    const payload: AcceptCallPayload = {
      callerName: firstname,
      channelName: this.incomingCallRequest?.channelName!,
      uid: customUid
    } 
     this.incomingCallRequest = null;
    this.agoraService.acceptVoiceCall(payload);
  }
 declineCall() {
    this.incomingCallRequest =null
  }


  ngOnDestroy(): void {
    this.incomingCallSubscription?.unsubscribe()
  }

  
  }
  


