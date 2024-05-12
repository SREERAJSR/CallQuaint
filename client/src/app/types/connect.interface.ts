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