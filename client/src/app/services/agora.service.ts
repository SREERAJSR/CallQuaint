import { HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AgoraRTC,{ClientConfig,IAgoraRTCClient,IAgoraRTCRemoteUser,IAgoraRTC} from 'agora-rtc-sdk-ng'
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AgoraService {

  constructor(private authService :AuthService) {
    this.iniRtc();

  }
  appid = environment.appid;
  token = null;
  rtcUid?:string

  rtcClient?: IAgoraRTCClient;
  config: ClientConfig = {
    codec: 'vp8',
    mode: 'rtc'
  }

audioTracks: {
  localAudioTrack:any,
  remoteAudioTrack: any // Index signature
} = {
  localAudioTrack: null,
  remoteAudioTrack: {} 
};
  iniRtc() {
    this.rtcClient = AgoraRTC.createClient(this.config);

    this.rtcClient.on('user-joined', this.handleUserJoined)
    this.rtcClient.on('user-published', this.handleUserPublished)
    this.rtcClient.on('user-left',this.handleUserLeft)
  }
 
  async handleUserJoined(user: IAgoraRTCRemoteUser) {
    console.log(user);
  }

  async handleUserPublished(user: IAgoraRTCRemoteUser, mediaType: "audio"|"video"|"datachannel") {
    await this.rtcClient?.subscribe(user, mediaType);
    if (mediaType === 'audio') {
      console.log('subscribe audio  sucess');
      this.audioTracks.remoteAudioTrack[user.uid] = [user.audioTrack];
      user.audioTrack?.play();
    }
  }

  async handleUserLeft(user:IAgoraRTCRemoteUser) {
    delete this.audioTracks.remoteAudioTrack[user.uid]
  }


  async join() {
    this.rtcClient?.join()
  }
}
