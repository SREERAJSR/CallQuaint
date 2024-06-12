import { AfterViewInit, Component, ElementRef, Injectable, OnInit, ViewChild, inject } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { ILocalVideoTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { Subscription } from 'rxjs';
import { AgoraService } from 'src/app/services/agora.service';
import { DeleteVideoCotainProviderInterface, VideoCallProviderInterface } from 'src/app/types/chat.interface';

@Injectable()
@Component({
  selector: 'app-video-call-screeen',
  templateUrl: './video-call-screeen.component.html',
  styleUrls: ['./video-call-screeen.component.css'],
})
export class VideoCallScreeenComponent  {
  @ViewChild('videoContainer') videoContainer?: ElementRef<HTMLDivElement>

  ids: string[] = [];
  idRemove: boolean = false;
  idRemoveInstructionSubscription?: Subscription;
  videoContainerInstruction?: boolean;
  videoContainerInstructionSubscripion$?: Subscription;
  constructor() {
    this.agoraService.openVideoContainer$.subscribe({
      next: (value: boolean) => {
        
        this.videoContainerInstruction =value
      }
    })

    this.idRemoveInstructionSubscription = this.agoraService.idRemoveInstruction$.subscribe({
      next: (instruction: boolean) => {
        if (instruction) {
          this.deleteContainers()
        }
      }
    })
    this.agoraService.videoCallProvider$.subscribe({
      next: (videoTrackProviders:VideoCallProviderInterface) => {
        if (videoTrackProviders.videoTrack) {
          const videoContainer = document.getElementById('videoContainer');
          const localVideoPlayerContainer = document.createElement('div')
          localVideoPlayerContainer.id = videoTrackProviders.uid
          this.ids.push(videoTrackProviders.uid)
          localVideoPlayerContainer.style.width = '684px';
          localVideoPlayerContainer.style.height = '360px';
          videoContainer?.append(localVideoPlayerContainer)
          videoTrackProviders.videoTrack?.play(localVideoPlayerContainer)
        }
      },
      error: (error: any) => {
        throw error
      }
    })
  }
  deleteVideoCallContainerProviderSubscription$ ?:Subscription
  agoraService = inject(AgoraService)


  ngAfterViewInit() {
    // this.agoraService.setVideoContainer(this.videoContainer!)
  }

  async endCall() {
    try {
      await this.agoraService.leaveVideoCall()
      this.deleteContainers()
    } catch (error) {
      console.log(error);
      throw error
    }
   
  }
  deleteContainers() {
    this.ids.forEach((id) => {
      document.getElementById(id)?.remove();
    })
    this.ids = [];
  }

  isMinimized:boolean = false; // Flag to track minimized state

  
  @ViewChild('videoCallScreen') videoCallScreen!: ElementRef;
  isCallMinimized = false;

  minimizeCall() {
    this.videoCallScreen.nativeElement.classList.add('hidden');
    this.isCallMinimized = true;
  }

  maximizeCall() {
    this.videoCallScreen.nativeElement.classList.remove('hidden');
    this.isCallMinimized = false;
  }
}
