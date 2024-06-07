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
  __v: number;
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