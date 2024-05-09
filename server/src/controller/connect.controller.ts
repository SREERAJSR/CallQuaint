import { NextFunction, Request, Response } from 'express';
import asyncHanlder from 'express-async-handler';
import User from '../models/user.model';
import AppError from '../utils/AppError';
import HttpStatus from '../types/constants/http-statuscodes';
import ApiResponse from '../utils/ApiReponse';
import { ConnectUserInterface } from '../types/app.interfaces';
import { ConnectTargetEnums } from '../types/constants/common.constant';

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