import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import AgoraRTC, { ClientConfig, IAgoraRTCClient, IAgoraRTCRemoteUser, IAgoraRTC,ILocalAudioTrack,IRemoteAudioTrack ,UID} from 'agora-rtc-sdk-ng'

import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';
@Injectable({
  providedIn: 'root'
})
export class AgoraService {

  constructor() {
  this.initRtc()
  }
  http: HttpClient = inject(HttpClient);
  rtcClient?: IAgoraRTCClient;
  API_URL = environment.api_Url;
  appid = environment.appid;
  // channel?: string;
  token = null;
  uid = null;
  channelParameters: {
    localAudioTrack: ILocalAudioTrack |null,
    remoteAudioTrack: IRemoteAudioTrack|null, 
    remoteUid:UID | null
  } = {
    localAudioTrack:null,
    remoteAudioTrack: null,
    remoteUid: null,
    };
  
  initRtc() {
    this.rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    
    this.rtcClient.on('user-published', async(user: IAgoraRTCRemoteUser, mediaType: 'audio' |'video') => {
      await this.rtcClient?.subscribe(user, mediaType);
      if (mediaType === 'audio') {
        console.log('subscribed audio sucess');
        user.audioTrack?.play()
      }
    })
    this.rtcClient.on('user-unpublished', async (user: IAgoraRTCRemoteUser) => {
      console.log('user left');
    })
  }

  async startCall(channelname:string) {
    await this.rtcClient?.join(this.appid, channelname , this.token, this.uid);
   this.channelParameters.localAudioTrack =  await AgoraRTC.createMicrophoneAudioTrack();
    await this.rtcClient?.publish([this.channelParameters.localAudioTrack])
  }

  async leaveCall() {
    this.channelParameters.localAudioTrack?.close();
    await this.rtcClient?.leave();
  }

  getChannelName(target:string) {
   return this.http.get<ApiResponse>(this.API_URL + `/user/connect/call?target=${target}`)

  }

}
