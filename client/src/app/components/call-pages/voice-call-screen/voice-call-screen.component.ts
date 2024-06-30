import {  Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgoraService } from 'src/app/services/agora.service';
import { VoiceCallInterfaceOpener } from 'src/app/types/chat.interface';

@Component({
  selector: 'app-voice-call-screen',
  templateUrl: './voice-call-screen.component.html',
  styleUrls: ['./voice-call-screen.component.css']
})
export class VoiceCallScreenComponent implements OnDestroy {

  openVoiceCallContainerSubscription?:Subscription
  constructor(private agoraService: AgoraService) {
  
  this.openVoiceCallContainerSubscription=  this.agoraService.openVoiceCallContainer$.subscribe({
      next: (value:VoiceCallInterfaceOpener  ) => {
        this.openContainer = value.open;
        this.callername =value.name

      }
    })
  }

  callername?: string
  openContainer: boolean = false;


 @ViewChild('voiceCallScreen') voiceCallScreen?: ElementRef<HTMLDivElement>;
  isCallMinimized = false;

  minimizeCall() {
    this.voiceCallScreen?.nativeElement.classList.add('hidden');
    this.isCallMinimized = true;
  }

  maximizeCall() {
    this.voiceCallScreen?.nativeElement.classList.remove('hidden');
    this.isCallMinimized = false;
  }

  declineCall() {
    this.agoraService.leaveVoiceCall()
    this.openContainer =false
  }

  ngOnDestroy(): void {
    this.openVoiceCallContainerSubscription?.unsubscribe()
  }
}
