import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler"
import AppError from "../utils/AppError";
import HttpStatus from "../types/http-statuscodes";



export const signupUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   throw new AppError('this is my last warning',400)
} );