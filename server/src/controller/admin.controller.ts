import { NextFunction, Request, Response } from "express";
import asyncHandler = require("express-async-handler");


export const loginAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string, password: string } = req.body;
    
})
