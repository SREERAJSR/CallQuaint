import { NextFunction, Request, Response } from 'express';
import asyncHanlder from 'express-async-handler';
import User from '../models/user.model';
import AppError from '../utils/AppError';
import HttpStatus from '../types/constants/http-statuscodes';
import ApiResponse from '../utils/ApiReponse';
import { ConnectUserInterface } from '../types/app.interfaces';
import { ConnectTargetEnums } from '../types/constants/common.constant';
import CallInfo from '../models/callInfo.model';

const selfHost:Set<ConnectUserInterface> = new Set<ConnectUserInterface>();
export const callSetup = asyncHanlder(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
  const { target } = req.query;
  const userid = req.user?._id;
  const user = await User.findById(userid);
 
  if (!user) throw new AppError("unauthorized", HttpStatus.UNAUTHORIZED);
  const userObject = { channelName: user.channelName, gender: user.gender, target: target } as ConnectUserInterface;

  if (target === ConnectTargetEnums.ANY) {
    const matchedAnyUsers = getRandomUsersByAnyTarget(target as string, userObject);
    console.log(matchedAnyUsers,'array');
    if (matchedAnyUsers.length > 0) {
      const randomRemoteUser = getRandomUser(matchedAnyUsers);
      selfHost.delete(randomRemoteUser);
      res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, randomRemoteUser, 'user got a remote user'));
      res.end();
      return; // Early return to prevent further execution
    }
  } else if (target === ConnectTargetEnums.MALE || target === ConnectTargetEnums.FEMALE) {
    const matchedTargetUsers = getRandomUsersByTarget(target as string, userObject);
    if (matchedTargetUsers.length > 0) { 
      const randomRemoteUser = getRandomUser(matchedTargetUsers);
      selfHost.delete(randomRemoteUser);
      res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, randomRemoteUser, 'user got a remote user'));
      res.end();  
      return; // Early return 
    } 
  }
  
  // If no target user is found
  selfHost.add(userObject);
  console.log(selfHost);
  res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, userObject, 'user is self hosted'));
  res.end();
})

export const saveCallInfoToDb = asyncHanlder(async(req: Request, res: Response, next: NextFunction)=>{
  
  const { remoteId, duration } = req.body;
  const formattedDuration = secondsToTimeString(Number(duration));
  const _id = req.user?._id;
  const user = await User.findById(_id);
  if (!user) throw new AppError("unauthorized", HttpStatus.UNAUTHORIZED);

  const existedCallInfo = await CallInfo.findOne({ userId: _id });
  if (!existedCallInfo) {
    const newCallInfo = new CallInfo({
      userId: _id,
      callInfo:[]
    })
    newCallInfo.callInfo.push({ remoteUserId: remoteId, callDuration: formattedDuration })
    await newCallInfo.save({ validateBeforeSave: false })
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, {}, "callinformation updated"))
    return
  } else {
    existedCallInfo.callInfo.push({ remoteUserId: remoteId, callDuration:formattedDuration })
    await existedCallInfo.save({ validateBeforeSave: false })
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, {}, "callinformation updated"))
    return
  } 

  // console.log(remoteId,duration);
  // const a = new CallInfo({ 
  //   userId: req.user?._id,
  // })
  // a.callInfo.push({ remoteUserId: remoteId, callDuration: duration })
  // a.save()

})


function getRandomUsersByAnyTarget(target:string,userObject:ConnectUserInterface) {
    return [...selfHost].filter((user) => user.target === userObject.target  )
}
function getRandomUsersByTarget(target: string, userObject: ConnectUserInterface) {
    return [...selfHost].filter((user)=>user.target===userObject.gender && userObject.target===user.gender)
}          
function getRandomUser(checkArray:ConnectUserInterface[]) {
  const randomIndex = Math.floor(Math.random() * checkArray.length);
  console.log(randomIndex,'randi');
    return checkArray[randomIndex]  
}  


function secondsToTimeString(seconds: number): string {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  // Return the time string in the format "minutes:seconds"
  return `${formattedMinutes}:${formattedSeconds}`;
}