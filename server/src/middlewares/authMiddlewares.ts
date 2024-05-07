import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import AppError from "../utils/AppError";
import HttpStatus from "../types/constants/http-statuscodes";
import jwt, { JwtPayload } from 'jsonwebtoken';
import configKey from "../configs/configkeys";
import User from "../models/user.model";

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token =  req.cookies?.accessToken?.trim() || req.header("authorization")?.replace("Bearer","").trim();
    console.log(token);
    if (!token) throw new AppError("Unauthorized request", HttpStatus.UNAUTHORIZED);
    try {
        
        const secret = configKey().ACCESS_TOKEN_SECRET;
        const decodedToken =  jwt.verify(token,secret) as JwtPayload ;    
        console.log(decodedToken,'jwt');
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
        if (!user) throw new AppError("Invalid access token", HttpStatus.UNAUTHORIZED);
        req.user = user;
        next()
    } catch (error:any) {
            throw new AppError( error?.message || "Invalid access token",HttpStatus.UNAUTHORIZED);
    }
})