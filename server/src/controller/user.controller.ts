import { NextFunction, Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler"
import AppError from "../utils/AppError";
import HttpStatus from "../types/constants/http-statuscodes";
import User from "../models/user.model";
import bcrypt from 'bcrypt'
import signup_token from "../models/signup-token";
import * as crypto from 'crypto';
import { config } from "rxjs";
import configKey from "../configs/configkeys";
import sendEmail from "../utils/create-email";
import { UserRolesEnum } from "../types/constants/common.constant";
import ApiResponse from "../utils/ApiReponse";
import { update } from "lodash";


export const signupUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const { firstname, lastname, email, gender, password } = req.body;
   const existedUser = await User.findOne({ email: email })
   if (existedUser) throw new AppError('This email is already associated with an account', HttpStatus.BAD_REQUEST);

   const user = await new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      gender: gender,
      password: password,
      isEmailVerified: false,
      role:UserRolesEnum.USER
   })

   const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken()

   user.emailVerificationToken = hashedToken;
   user.emailVerificationExpiry = tokenExpiry;

   await user.save({ validateBeforeSave: false });
   
   const message = `${configKey().BASE_URL}/user/verify/${unHashedToken}`;
   await sendEmail(email, 'verify email', message);

   const createdUser = await User.findById(user._id).select(
      "-avatar -password -refreshToken -emailVerficationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry "
   );
   if (!createdUser) throw new AppError("Something went wrong while registering the user", HttpStatus.INTERNAL_SERVER_ERROR);
   res.status(HttpStatus.ACCEPTED).json(new ApiResponse(HttpStatus.OK, { user: createdUser }, "Users registered successfully and verification email has been sent on your email."))
});
 

export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {    
   const { verificationToken } = req.params;
   if (!verificationToken) throw new AppError("Email verification token is missing", HttpStatus.BAD_REQUEST);
   
   const hashedToken = crypto.createHash('sha256').update(verificationToken).digest("hex");

   const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
   })
   if (!user) throw new AppError("Token is invalid or expired", HttpStatus.UNAUTHORIZED);

   user.emailVerificationToken = undefined;
   user.emailVerificationExpiry = undefined;
   user.isEmailVerified = true;

   await user.save({ validateBeforeSave: false })
   res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK,{isEmailVerified:true}))
}
);
