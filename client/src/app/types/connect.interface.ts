export interface ICallHistory{
  id:number,
        remoteId: string,
        firstname: string,
  callduration: string,
  date: Date,
  requestSent:boolean
  
      }

  export interface RemoteUser {
    _id: string;
    firstname: string;
    lastname: string;
}

export interface CallhistoryRespone {
    remoteUserId: RemoteUser;
    callDuration: string;
    date: string;
  _id: string;
  requestSent:boolean
}

export interface IRequestsDataSource{
  id: number;
  remoteId: string,
  name:string
}

export interface IFriendRequests{
  _id: string,
  firstname: string;
}

export interface IFriendRequestsApiresponse{
  data:IFriendRequests[]
}

export interface IfriendsList{
  _id: string,
  firstname:string
}

export interface IFriendsListDataSource{
  id: number;
  remoteId: string,
  name:string
}
