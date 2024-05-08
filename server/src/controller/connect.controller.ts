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
    const { target} = req.query
    const userid = req.user?._id;
    const user = await User.findById(userid);
    if (!user) throw new AppError("unauthorized", HttpStatus.UNAUTHORIZED);
    const userObject = { channelName: user.channelName, gender: user.gender, target: target } as ConnectUserInterface;
    if (target === ConnectTargetEnums.ANY) {
        const matchedAnyUsers = getRandomUsersByAnyTarget(target as string, userObject)
        if (matchedAnyUsers.length === 0) {
            selfHost.add(userObject);
            res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, userObject, 'user is self hosted'));
        }
        const randomRemoteUser = getRandomUser(matchedAnyUsers)
        selfHost.delete(randomRemoteUser);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, randomRemoteUser, 'user got a remote user'));
    } else if (target === ConnectTargetEnums.MALE) {
        const matchedMaleUsers = getRandomUsersByTarget(target as string, userObject)
        if (matchedMaleUsers.length === 0) {
            selfHost.add(userObject);
      res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, userObject, 'user is self hosted'));
        }
        const randomRemoteUser = getRandomUser(matchedMaleUsers)
        selfHost.delete(randomRemoteUser);
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, randomRemoteUser, 'user got a remote user'));
    } else if (target === ConnectTargetEnums.FEMALE) {
        const matchedFemaleUsers = getRandomUsersByTarget(target as string, userObject)
        if (matchedFemaleUsers.length === 0) {
            selfHost.add(userObject)
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, userObject, 'user is self hosted'));
        }
        const randomRemoteUser = getRandomUser(matchedFemaleUsers);
        selfHost.delete(randomRemoteUser);
       res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, randomRemoteUser, 'user got a remote user'));
    }
        
})

function getRandomUsersByAnyTarget(target:string,userObject:ConnectUserInterface) {
    return [...selfHost].filter((user) => user.target === userObject.gender)
}
function getRandomUsersByTarget(target: string, userObject: ConnectUserInterface) {
    return [...selfHost].filter((user)=>user.target===userObject.gender && userObject.target===user.gender)
}          
function getRandomUser(checkArray:ConnectUserInterface[]) {
    const randomIndex = Math.floor(Math.random() * checkArray.length);
    return checkArray[randomIndex]
}