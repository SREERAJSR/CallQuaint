import { ILocalVideoTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";

export interface Participant {
  _id: string;
  avatar: string;
  firstname: string;
  lastname: string;
  gender: string;
  email: string;
  role: string;
  loginType: string;
  isEmailVerified: boolean;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  requestSent?: string[];
  typing?:boolean
}

export  interface LastMessage {
  _id: string;
  sender: {
    _id: string;
    avatar: string;
    email: string;
  };
  content: string;
  attachments: any[];
  chat: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  name: string;
  isGroupChat: boolean;
  participants: Participant[];
  admin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage?: LastMessage;
}


export interface IChatList{
  userId: string;
    chatId: string;
    name: string;
    avatar: string;
    gender: string;
  lastMessage?: LastMessage;
  online?:boolean
}

export interface OnlineUsers{
    userId: string,
    name:string
}

export interface SendChatIdAndRecieverIdInterface{
chatId: string, recieverId: string 
}

export interface IVideoCallSocketEventPayload{
  callerId: string
  callerName: string,
  callType:'audio' |'video'
  chatId: string;
  userId: string;
  channelName: string
  uid:string
}

export interface AcceptCallPayload{
  uid: string;
  channelName: string,
  callerName: string;
  remoteId?: string,
  callType?:string
}

export interface VideoCallProviderInterface{
  videoTrack: IRemoteVideoTrack | ILocalVideoTrack,
  uid: string,
  openVideoContainer?:boolean
}

export interface DeleteVideoCotainProviderInterface {
  user_id: string,
  remoteUserId:string
}

export interface VoiceCallInterfaceOpener{ name: string, open: boolean }