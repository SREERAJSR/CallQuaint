import { HttpClient, HttpHandler } from '@angular/common/http';
import { ElementRef, Injectable, inject } from '@angular/core';
import AgoraRTC, { ClientConfig, IAgoraRTCClient, IAgoraRTCRemoteUser, IAgoraRTC,ILocalAudioTrack,IRemoteAudioTrack ,UID, ILocalVideoTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng'
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';
import { Subject } from 'rxjs';
import { AcceptCallPayload, DeleteVideoCotainProviderInterface, IVideoCallSocketEventPayload, VideoCallProviderInterface } from '../types/chat.interface';
import { ChatService } from './chat.service';
@Injectable({
  providedIn: 'root'
})
export class AgoraService {

  constructor() {
  this.initRtc()
  }
  http: HttpClient = inject(HttpClient);
  chatService: ChatService = inject(ChatService)
  rtcClient?: IAgoraRTCClient;
  API_URL = environment.api_Url;
  appid = environment.appid;
  duration: number = 0;
  token = null;
  uid = '007eJxTYGD+75f4Zem74MbJbtuY1locbHhnq8Dfkcn51rgt2i8v9IYCg5GJpXmaSZKhcaqlkUmKhUViqrGBkYlpsqWRaZKRhYWBn3tGWkMgI0PqwSNMjAwQCOJzMyRnJOblpeb4JeamMjAAAN6PIKc='
  user_id?: string | null =null
  remote_userId?: string | null = null;
  // videoContainer?:ElementRef<HTMLDivElement>
  private callType: 'audio' | 'video' | null = null;
  strangerInfoSupplier: Subject<{ name: string, gender: string }> = new Subject<{ name: string, gender: string }>();
  remoteVideoPublished$ = new Subject<IAgoraRTCRemoteUser>();
  videoCallProvider$ = new Subject<VideoCallProviderInterface>();
  channelParameters: {
    localAudioTrack: ILocalAudioTrack | null,
    localVideoTrack:ILocalVideoTrack |null,
    remoteAudioTrack: IRemoteAudioTrack | null,
    remoteVideoTrack: IRemoteVideoTrack | null,
    remoteUid: UID | null,
    remoteUser:IAgoraRTCRemoteUser |null,
    client:IAgoraRTCClient |null
  } = {
    localAudioTrack:null,
      remoteAudioTrack: null,
      localVideoTrack: null,
      remoteVideoTrack:null,
      remoteUid: null,
      client: null,
    remoteUser:null
    };
  idRemoveInstruction$ = new Subject<boolean>();
  initRtc() {
    this.rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    
    this.rtcClient.on('user-joined', async (user: IAgoraRTCRemoteUser) => {
      try {
          if (user.hasVideo && user.hasVideo) {
        console.log('yes');
        const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
            this.videoCallProvider$.next({ videoTrack: remoteVideoTrack, uid: user.uid.toString() })
            // this.remote_userId = user.uid.toString();
      } else {
        console.log('user user user user ',user);
            const  {gender,fname}  =    this.getremoteIdAndGender(user.uid)
        this.strangerInfoSupplier.next({ name: fname, gender: gender })
        }
      } catch (error) {
        console.log(error);
        throw error;   
      }
     
      })
    this.rtcClient.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      try {
         await this.rtcClient?.subscribe(user, mediaType);
      if (mediaType === 'video' && user.hasVideo) {
        console.log('subscribed video sucess');
        const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
        // this.remoteVideoPublished$.next(user); 
       this.videoCallProvider$.next({videoTrack:remoteVideoTrack,uid:user.uid.toString()})
      }
      if (mediaType === 'audio') {
        console.log('subscribed audio sucess');
        this.channelParameters.remoteUid = user.uid;
        this.channelParameters.remoteUser = user
        const remoteAudioTrack = user.audioTrack;
        // user.audioTrack?.play()
        remoteAudioTrack?.play()

      }
      } catch (error) {
        console.log(error);
        throw error;
      }
     
    })

  
    this.rtcClient.on('user-unpublished', async (user: IAgoraRTCRemoteUser) => {
      try {
           if (this.callType === 'audio') {
      this.duration = this.rtcClient?.getRTCStats().Duration as number;
      this.leaveCall();
      this.strangerInfoSupplier.next({name:'user left',gender:'nouser'})
      } else if (this.callType === 'video') {
             await this.rtcClient?.unsubscribe(user)
             this.leaveVideoCall()
             this.callType = null
             this.idRemoveInstruction$.next(true)
      }
      } catch (error) {
        console.log(error);
        throw error;
      }
   
  
    })
  }

  async startCall(channelname: string, uid: string) {
    this.callType = 'audio';
    await this.rtcClient?.join(this.appid, channelname , this.token, uid);
   this.channelParameters.localAudioTrack =  await AgoraRTC.createMicrophoneAudioTrack();
    await this.rtcClient?.publish([this.channelParameters.localAudioTrack])
  }

  async leaveCall() {
    this.channelParameters.localAudioTrack?.close();
    await this.rtcClient?.leave();
    this.duration = this.rtcClient?.getRTCStats().Duration as number
    this.saveCallInfoToDB()
    this.callType = null;
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

  async startVideoCall(payload: AcceptCallPayload) {
  try {
    this.callType = 'video'
    await this.rtcClient?.join(this.appid, payload.channelName, this.token, payload.uid)
    this.channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await this.rtcClient?.publish([this.channelParameters.localAudioTrack, this.channelParameters.localVideoTrack]);
    this.videoCallProvider$.next({videoTrack:this.channelParameters.localVideoTrack,uid:payload.uid})
    this.chatService.emitCallRequest(payload)
    // this.user_id = payload.uid;
  } catch (error) {
    console.error(error);
    throw error;
  }
   
 }
  
  async acceptCall(payload: AcceptCallPayload) {
    try {
      this.callType = 'video';
      await this.rtcClient?.join(this.appid, payload.channelName, this.token, payload.uid);
      this.channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      this.channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      await this.rtcClient?.publish([this.channelParameters.localAudioTrack, this.channelParameters.localVideoTrack]);
      this.videoCallProvider$.next({ videoTrack: this.channelParameters.localVideoTrack, uid: payload.uid })
      // this.user_id = payload.uid;
    } catch (error) {
      console.log(error);
      throw error
    }
   
  }
  async leaveVideoCall() {
    try {
       await this.rtcClient?.unpublish([this.channelParameters.localAudioTrack as ILocalAudioTrack, this.channelParameters.localVideoTrack as ILocalVideoTrack]);
    this.channelParameters.localAudioTrack?.close();
      this.channelParameters.localVideoTrack?.close();
      this.callType = null;
      await this.rtcClient?.leave();
      // this.deleteVideoContainerIdProvider$.next({ user_id: this.user_id!, remoteUserId: this.remote_userId! })
    } catch (error) {
      console.log(error);
      throw error;
    }
   
  }
 
  getremoteIdAndGender(remoteUserId:UID) {
    const [remoteId, fname, gender] = remoteUserId.toString().split(' ')
    return {remoteId,fname,gender}
  }


}
