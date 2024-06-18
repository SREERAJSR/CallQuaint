import { HttpClient, HttpHandler } from '@angular/common/http';
import { ElementRef, Injectable, inject } from '@angular/core';
import AgoraRTC, { ClientConfig, IAgoraRTCClient, IAgoraRTCRemoteUser, IAgoraRTC,ILocalAudioTrack,IRemoteAudioTrack ,UID, ILocalVideoTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng'
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../types/api.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { AcceptCallPayload, DeleteVideoCotainProviderInterface, IVideoCallSocketEventPayload, VideoCallProviderInterface, VoiceCallInterfaceOpener } from '../types/chat.interface';
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
  uid = null;
  user_id?: string | null =null
  remote_userId?: string | null = null;
  // videoContainer?:ElementRef<HTMLDivElement>
  private callType: 'random' | 'video' | 'voice' | null = null;
  strangerInfoSupplier: Subject<{ name: string, gender: string }> = new Subject<{ name: string, gender: string }>();
  remoteVideoPublished$ = new Subject<IAgoraRTCRemoteUser>();
  videoCallProvider$ = new Subject<VideoCallProviderInterface >();
  openVideoContainer$ = new BehaviorSubject<boolean>(false);
  openVoiceCallContainer$ = new BehaviorSubject<VoiceCallInterfaceOpener >({name:'',open:false});
  voiceCallProvider$ = new Subject<string |null>()
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
          if ( this.callType==='video') {
        const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
            this.videoCallProvider$.next({ videoTrack: remoteVideoTrack, uid: user.uid.toString() })
            // this.remote_userId = user.uid.toString();
          } else if (this.callType === 'random') {
            const  {gender,fname}  =    this.getremoteIdAndGender(user.uid)
        this.strangerInfoSupplier.next({ name: fname, gender: gender })
          } else if (this.callType === 'voice') {
            const {fname}=this.getremoteIdAndGender(user.uid)
            //voice call providers
            console.log(fname);
            this.openVoiceCallContainer$.next({name:fname,open:true})
        }
      } catch (error) {
        console.log(error);
        throw error;   
      }
     
      })
    this.rtcClient.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      try {
         await this.rtcClient?.subscribe(user, mediaType);
      if (mediaType === 'video' && this.callType ==='video') {
        console.log('subscribed video sucess');
        const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
        this.videoCallProvider$.next({ videoTrack: remoteVideoTrack, uid: user.uid.toString() })
            this.channelParameters.remoteUid = user.uid;
        this.channelParameters.remoteUser = user
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack?.play()
      }
      else if (mediaType === 'audio' && this.callType==='random' ) {
        this.channelParameters.remoteUid = user.uid;
        this.channelParameters.remoteUser = user
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack?.play()

      }
      else  if (mediaType === 'audio' && this.callType === 'voice') {
          this.channelParameters.remoteUid = user.uid;
          this.channelParameters.remoteUser = user
          const remoteAudioTrack = user.audioTrack;
        //voice call providers
        // this.openVoiceCallContainer$.next({name:})
        remoteAudioTrack?.play()
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
     
    })

  
    this.rtcClient.on('user-unpublished', async (user: IAgoraRTCRemoteUser) => {
      try {
           if (this.callType === 'random') {
      this.duration = this.rtcClient?.getRTCStats().Duration as number;
      this.leaveCall();
      this.strangerInfoSupplier.next({name:'user left',gender:'nouser'})
      } else if (this.callType === 'video') {
             await this.rtcClient?.unsubscribe(user)
             this.leaveVideoCall()
             this.callType = null
             this.idRemoveInstruction$.next(true)
           } else if (this.callType === 'voice') {
             this.openVoiceCallContainer$.next({ name: '', open: false })
             this.leaveVoiceCall()
             this.callType = null;
      }
      } catch (error) {
        console.log(error);
        throw error;
      }
   
  
    })
  }
  ///random call section statt

  async startCall(channelname: string, uid: string) {
    this.callType = 'random';
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
  async leaveWithOutCall() {
  this.channelParameters.localAudioTrack?.close();
    await this.rtcClient?.leave();
    this.callType =null
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

  //random calll section end

  

  //video call section

  async startVideoCall(payload: AcceptCallPayload) {
  try {
    this.callType = 'video'

        await this.openVideoContainer(true)
    await this.rtcClient?.join(this.appid, payload.channelName, this.token, payload.uid)
    this.channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await this.rtcClient?.publish([this.channelParameters.localAudioTrack, this.channelParameters.localVideoTrack]);
    this.videoCallProvider$.next({ videoTrack: this.channelParameters.localVideoTrack, uid: payload.uid })
    payload.callType='video call'
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
        await this.openVideoContainer(true)
      await this.rtcClient?.join(this.appid, payload.channelName, this.token, payload.uid);
      this.channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      this.channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    
      await this.rtcClient?.publish([this.channelParameters.localAudioTrack, this.channelParameters.localVideoTrack]);
      this.videoCallProvider$.next({ videoTrack: this.channelParameters.localVideoTrack, uid: payload.uid })
    } catch (error) {
      console.log(error);
      throw error
    }
   
  }
  async leaveVideoCall() {
    try {
        await this.openVideoContainer(false)
       await this.rtcClient?.unpublish([this.channelParameters.localAudioTrack as ILocalAudioTrack, this.channelParameters.localVideoTrack as ILocalVideoTrack]);
    this.channelParameters.localAudioTrack?.close();
      this.channelParameters.localVideoTrack?.close();
      this.callType = null;
      await this.rtcClient?.leave();
      this.openVideoContainer$.next(false)
    } catch (error) {
      console.log(error);
      throw error;
    }
   
  }

  //video call section end




  ///voical call section start

  async startVoiceCall(payload: AcceptCallPayload,customUid:string) {
    try {
          this.callType = 'voice';
     await this.rtcClient?.join(this.appid, payload.channelName, this.token, customUid);
   this.channelParameters.localAudioTrack =  await AgoraRTC.createMicrophoneAudioTrack();
      await this.rtcClient?.publish([this.channelParameters.localAudioTrack])
      payload.callType = 'voice call'
      this.chatService.emitCallRequest(payload)
      this.openVoiceCallContainer$.next({name:"calling",open:true})
    } catch (error) {
      console.log(error);
      throw error;
    }

  }

  async acceptVoiceCall(payload: AcceptCallPayload) {
    try {
      this.callType = 'voice';
      await this.rtcClient?.join(this.appid, payload.channelName, this.token, payload.uid);
         this.channelParameters.localAudioTrack =  await AgoraRTC.createMicrophoneAudioTrack();
      await this.rtcClient?.publish([this.channelParameters.localAudioTrack])

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async leaveVoiceCall() {
    this.channelParameters.localAudioTrack?.close();
    await this.rtcClient?.leave();
    this.callType = null;
  }

  //voice callsection end


 
  getremoteIdAndGender(remoteUserId:UID) {
    const [remoteId, fname, gender] = remoteUserId.toString().split(' ')
    return {remoteId,fname,gender}
  }

  async openVideoContainer(value:boolean) {
    this.openVideoContainer$.next(value)
  }

}
