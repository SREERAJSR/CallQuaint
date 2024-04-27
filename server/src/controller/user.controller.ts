import { NextFunction, Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler"
import AppError from "../utils/AppError";
import HttpStatus from "../types/constants/http-statuscodes";
import User from "../models/user.model";
import * as crypto from 'crypto';
import configKey from "../configs/configkeys";
import sendEmail from "../utils/create-email";
import { SocialLoginEnums, UserRolesEnum } from "../types/constants/common.constant";
import ApiResponse from "../utils/ApiReponse";
import { generateAcessTokenAndrefreshToken } from "../services/user.services";
import jwt, { JwtPayload } from 'jsonwebtoken';



export const signupUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const { firstname, lastname, email, gender, password } = req.body;
   const existedUser = await User.findOne({ email: email })
   if (existedUser) throw new AppError('This email is already associated with an account', HttpStatus.BAD_REQUEST);

   const user = await new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      isEmailVerified: false,
      role:UserRolesEnum.USER
   })

   const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken()

   user.emailVerificationToken = hashedToken;
   user.emailVerificationExpiry = tokenExpiry;

   await user.save({ validateBeforeSave: false });
   
   const url = `${configKey().ORIGIN}/login/${unHashedToken}`;
   await sendEmail(email, 'verify email', url);

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


export const loginUser = asyncHandler(async(req: Request, res: Response, next: NextFunction):Promise<void> => {
   const { email, password } = req.body;
   
   const user = await User.findOne({ email: email });
   if (!user) throw new AppError("User does not exist", HttpStatus.NOT_FOUND);
   if (user.loginType !== SocialLoginEnums.EMAIL_PASSWORD)
      throw new AppError(`You have previously registered using ${user.loginType.toLowerCase()} please use the ${user.loginType.toLowerCase()} login option for access your account`, HttpStatus.BAD_REQUEST);

   const isPasswordValid = await user.isPasswordCorrect(password);
   if (!isPasswordValid) throw new AppError("invalid credentials", HttpStatus.UNAUTHORIZED);

   const { accessToken, refreshToken } = await generateAcessTokenAndrefreshToken(user._id);
   const loggedInUser = await User.findById(user._id).select(
      "-avatar -password -refreshToken -emailVerficationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry "
   );
   const options = {
    httpOnly: true,
    secure:configKey().NODE_ENV=== "production",
   };
   res.status(HttpStatus.OK).
      cookie('accesToken', accessToken)
      .cookie('refreshToken', refreshToken).
      json(new ApiResponse(HttpStatus.OK, { user: loggedInUser, accessToken: accessToken, refreshToken: refreshToken }, "user logged in succesfully"));
})

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   console.log(req.cookies)
   const incomingRefreshToken: string = req.cookies.refreshToken || req.body.incomingRefreshToken;
   if (!incomingRefreshToken) throw new AppError("Unauthorized request", HttpStatus.UNAUTHORIZED);
   try {
      const decodedToken = await jwt.verify(
         incomingRefreshToken,
         configKey().REFRESH_TOKEN_SECRET) as JwtPayload;
      const user = await User.findById(decodedToken?._id)
      if (!user) throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED);
      if (incomingRefreshToken !== user?.refreshToken)
         throw new AppError("Refresh token is expired or used", HttpStatus.UNAUTHORIZED);
      const { accessToken, refreshToken: newRefreshToken } =
         await generateAcessTokenAndrefreshToken(user._id);
         const options = {
      httpOnly: true,
      secure:configKey().NODE_ENV === "production",
         };
      res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
      
   } catch (error) {
         throw new AppError("Invalid refresh token", HttpStatus.UNAUTHORIZED)
   }
});

export const forgotPasswordRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const { email } = req.body;
   const user = await User.findOne({ email: email });
   if (!user) throw new AppError("user doesn't exist with this email", HttpStatus.BAD_REQUEST);

   const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();
   user.forgotPasswordToken = hashedToken;
   user.forgotPasswordExpiry = tokenExpiry;
   await user.save({ validateBeforeSave: false });

   const url = `${configKey().BASE_URL}/user/reset-password/${unHashedToken}`

   await sendEmail(email, "Please verify your email to reset password", url)
   
   res.status(200).json(new ApiResponse(HttpStatus.OK, {}, "Password reset mail has been sent on your mail id"));
});

export const resetPasswordRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const { password, confirm_password } = req.body;
   const { resetToken } = req.params;
   if (password !== confirm_password) throw new AppError("Both passwords are not same", HttpStatus.BAD_GATEWAY);

   const hashedToken = await crypto.createHash('sha256').update(resetToken).digest('hex');
   if (!hashedToken) throw new AppError("token is wrong", HttpStatus.BAD_REQUEST);

   const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { $gt: Date.now() }
   });

   if (!user) throw new AppError("token is invalid or expired", HttpStatus.BAD_EVENT);

   user.forgotPasswordToken = undefined;
   user.forgotPasswordExpiry = undefined;
   user.password = password;

   await user.save({ validateBeforeSave: false });
   res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, {}, "reset password sucessfully"));

})


export const handleSocialLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

   const _id = req?.user?._id.toString()
   
   const user = await User.findById(_id)
   if (!user) {
      throw new AppError("user does not exist",HttpStatus.NOT_FOUND)
   }
   
   const { accessToken, refreshToken } =await  generateAcessTokenAndrefreshToken(_id)
     const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

   res
    .status(HttpStatus.MOVED_PERMANENTLY)
    .cookie("accessToken", accessToken, options) // set the access token in the cookie
    .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
    .redirect(
      // redirect user to the frontend with access and refresh token in case user is not using cookies
      `${configKey().CLIENT_SSO_REDIRECT_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
})  