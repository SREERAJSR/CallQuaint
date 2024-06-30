import { Component, ElementRef, Injectable,  OnDestroy,  ViewChild, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgoraService } from 'src/app/services/agora.service';
import { VideoCallProviderInterface } from 'src/app/types/chat.interface';

@Injectable()
@Component({
  selector: 'app-video-call-screeen',
  templateUrl: './video-call-screeen.component.html',
  styleUrls: ['./video-call-screeen.component.css'],
})
export class VideoCallScreeenComponent implements OnDestroy {
  @ViewChild('videoContainer') videoContainer?: ElementRef<HTMLDivElement>
  @ViewChild('videoCallScreen') videoCallScreen!: ElementRef;
  isCallMinimized = false;

  ids: string[] = [];
  idRemove: boolean = false;
  isMinimized:boolean = false; // Flag to track minimized state
  agoraService = inject(AgoraService)
  videoContainerInstruction?: boolean;
  idRemoveInstructionSubscription?: Subscription;
  openVideoContainerSubscription?: Subscription;
  videoCallProviderSubscription?:Subscription
  constructor() {
    this.openVideoContainerSubscription =this.agoraService.openVideoContainer$.subscribe({
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
    this.videoCallProviderSubscription = this.agoraService.videoCallProvider$.subscribe({
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
  


  async endCall() {
    try {
      await this.agoraService.leaveVideoCall()
      this.deleteContainers()
    } catch (error) {
      throw error
    }
   
  }
  deleteContainers() {
    this.ids.forEach((id) => {
      document.getElementById(id)?.remove();
    })
    this.ids = [];
  }

  

  

  minimizeCall() {
    this.videoCallScreen.nativeElement.classList.add('hidden');
    this.isCallMinimized = true;
  }

  maximizeCall() {
    this.videoCallScreen.nativeElement.classList.remove('hidden');
    this.isCallMinimized = false;
  }

  ngOnDestroy(): void {
    this.idRemoveInstructionSubscription?.unsubscribe();
    this.openVideoContainerSubscription?.unsubscribe();
    this.videoCallProviderSubscription?.unsubscribe()
  }

}
