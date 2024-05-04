import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import AppError from "../utils/AppError";
import HttpStatus from "../types/constants/http-statuscodes";
import jwt, { JwtPayload } from 'jsonwebtoken';
import configKey from "../configs/configkeys";
import User from "../models/user.model";

const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
    if (!token) throw new AppError("Unauthorized request", HttpStatus.UNAUTHORIZED);

    try {
        const decodedToken:JwtPayload = await jwt.verify(token, configKey().ACCESS_TOKEN_SECRET) as JwtPayload;    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
        if (!user) throw new AppError("Invalid access token", HttpStatus.UNAUTHORIZED);
        
        req.user = user;
        next()
    } catch (error) {
        if(error instanceof(Error))
            throw new AppError( error?.message || "Invalid access token",HttpStatus.UNAUTHORIZED);
        
    }
})