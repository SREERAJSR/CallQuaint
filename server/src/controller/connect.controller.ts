import { NextFunction, Request, Response } from 'express';
import asyncHanlder from 'express-async-handler';
import User from '../models/user.model';
import AppError from '../utils/AppError';
import HttpStatus from '../types/constants/http-statuscodes';
import ApiResponse from '../utils/ApiReponse';

const selfHost:Set<string> = new Set<string>();
const remoteHost:Set<string> = new Set<string>();
export const callSetup = asyncHanlder(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?._id;
   
    const user = await User.findById(userid);
    if (!user) throw new AppError("unauthorized", HttpStatus.UNAUTHORIZED);
    
    if (selfHost.size === remoteHost.size) {
        selfHost.add(user.channelName);
    } else remoteHost.add(user.channelName);

    if (selfHost.has(user.channelName)) {
          console.log('selfHost:',selfHost);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, { channelName: user.channelName },"user is self hosted"))
    } else if (remoteHost.has(user.channelName)) {
        const checkArray = Array.from(selfHost)

        const randomIndex = Math.floor(Math.random() * checkArray.length);
        const selectedUser = checkArray[randomIndex];
        
        selfHost.delete(selectedUser);
        remoteHost.delete(user.channelName);
 res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, { channelName:selectedUser},"user is remote  hosted"))

    }
})