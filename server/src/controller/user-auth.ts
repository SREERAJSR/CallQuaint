import { NextFunction, Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler"
import AppError from "../utils/AppError";
import HttpStatus from "../types/http-statuscodes";
import User from "../models/user-model";
import bcrypt from 'bcrypt'
import signup_token from "../models/signup-token";
import * as crypto from 'crypto';
import { config } from "rxjs";
import configKey from "../configs/configkeys";
import sendEmail from "../utils/create-email";


export const signupUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const { firstname, lastname, email, gender, password, confirm_password } = req.body;
   const user = await User.findOne({ email: email })
   if (user) throw new AppError('This email is already associated with an account', HttpStatus.BAD_REQUEST);

   const saltaround = 10;
   const hashedPassword = await bcrypt.hash(password, saltaround);
   const newUser = await new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      gender: gender,
      password:hashedPassword
   }).save();
   const token = await new signup_token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString('hex')
   }).save();
   const message = `${configKey().BASE_URL}/verify/${newUser.id}/${token.token}`;
   await sendEmail(email, 'verify email', message);
 res.status(HttpStatus.OK).send("An Email sent to your account please verify");
});


export const verifyUser = asyncHandler(async (req: Request, res: Response, next: NextFunction):Promise<any> => {   
   const { id } = req.params;
   const user = await User.findById(id);
   if (!user) return res.status(400).send("Invalid link");
   const token = await signup_token.findOne({
      userId: user._id,
      token: req.params.token,
   });
   if (!token) return res.status(400).send("Invalid link");
   await User.updateOne({ _id: user._id, verified: true });
   await signup_token.findByIdAndDelete(token._id);
   res.send("email verified sucessfully");
}
);
