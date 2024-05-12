import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import AgoraRTC, { ClientConfig, IAgoraRTCClient, IAgoraRTCRemoteUser, IAgoraRTC,ILocalAudioTrack,IRemoteAudioTrack ,UID} from 'agora-rtc-sdk-ng'

import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';
import { Subject } from 'rxjs';
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
  duration: number = 0;
  // channel?: string;
  token = null;
  // uid = null;
 strangerInfoSupplier:Subject<{name:string,gender:string}> = new Subject<{name:string,gender:string}>();
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
    
      this.rtcClient.on('user-joined', async (user: IAgoraRTCRemoteUser) => {
           const  {gender,fname}  =    this.getremoteIdAndGender(user.uid)
        this.strangerInfoSupplier.next({ name: fname, gender: gender })

    })
    this.rtcClient.on('user-published', async(user: IAgoraRTCRemoteUser, mediaType: 'audio' |'video') => {
      await this.rtcClient?.subscribe(user, mediaType);
      if (mediaType === 'audio') {
        console.log('subscribed audio sucess');
        this.channelParameters.remoteUid = user.uid;
        user.audioTrack?.play()
    //       setTimeout(() => {
    //         this.leaveCall();
    // }, 1 * 60 * 1000);
      }
    })

  
    this.rtcClient.on('user-unpublished', async (user: IAgoraRTCRemoteUser) => {
      console.log('user left', user.uid.toString().split(' '));
      this.duration = this.rtcClient?.getRTCStats().Duration as number;
      this.leaveCall();
      this.strangerInfoSupplier.next({name:'user left',gender:'nouser'})
    })
  }

  async startCall(channelname:string,uid:string) {
    await this.rtcClient?.join(this.appid, channelname , this.token, uid);
   this.channelParameters.localAudioTrack =  await AgoraRTC.createMicrophoneAudioTrack();
    await this.rtcClient?.publish([this.channelParameters.localAudioTrack])
  }

  async leaveCall() {
    this.channelParameters.localAudioTrack?.close();
    await this.rtcClient?.leave();
    this.duration = this.rtcClient?.getRTCStats().Duration as number
    this.saveCallInfoToDB()
  }

  getChannelName(target:string) {
   return this.http.get<ApiResponse>(this.API_URL + `/user/connect/call?target=${target}`)
  }

  saveCallInfoToDB() {
    const {remoteId} =this.getremoteIdAndGender(this.channelParameters.remoteUid!)
    const payload = {remoteId:remoteId,duration:this.duration,date: new Date() }
    this.http.post<ApiResponse>(this.API_URL + '/user/connect/saveCallInfo', payload).subscribe({
      next: (response) => {
        console.log(response);
   }
 })
  }
 
  getremoteIdAndGender(remoteUserId:UID) {
    const [remoteId, fname, gender] = remoteUserId.toString().split(' ')
    return {remoteId,fname,gender}
  }
}
