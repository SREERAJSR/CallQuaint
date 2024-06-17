import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AgoraService } from 'src/app/services/agora.service';
import { VoiceCallInterfaceOpener } from 'src/app/types/chat.interface';

@Component({
  selector: 'app-voice-call-screen',
  templateUrl: './voice-call-screen.component.html',
  styleUrls: ['./voice-call-screen.component.css']
})
export class VoiceCallScreenComponent {

  constructor(private agoraService: AgoraService) {
  
    this.agoraService.openVoiceCallContainer$.subscribe({
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
}
