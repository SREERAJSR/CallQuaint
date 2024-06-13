import { NextFunction, Request, Response } from 'express';
import asynchHandler from 'express-async-handler';
import { Subscription } from '../models/subscription.model';
import HttpStatus from '../types/constants/http-statuscodes';
import AppError from '../utils/AppError';
import ApiResponse from '../utils/ApiReponse';
import { IsubscriptionPlan, IsubscriptionPlanRequestBody } from '../types/model/subscriptionmodel.interface';

export const getSubscriptionPlans = asynchHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const subscriptPlans = await Subscription.find();
    if (!subscriptPlans) {
        throw new AppError('Subscriptons plans does not exist ',HttpStatus.NOT_FOUND)
    }
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK,subscriptPlans,"Subscription plans fetched sucessfully"))
})

export const createSubscriptionPlan = asynchHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const subscriptionPlanDetails = req.body as IsubscriptionPlanRequestBody;

    if (!subscriptionPlanDetails) {
        throw new AppError("Request body is empty",HttpStatus.BAD_REQUEST)
    }
    const existingPlanNameDetails = await Subscription.findOne({
        planname: subscriptionPlanDetails.planname,
    })
    if (existingPlanNameDetails) 
        throw new AppError("This planname is already exist ", HttpStatus.BAD_REQUEST)
    
      // Check if plantype already exists
 const existingPlanTypeDetails = await Subscription.findOne({
        plantype: subscriptionPlanDetails.plantype,
        plandurationunit: subscriptionPlanDetails.plandurationunit
    });
    if (existingPlanTypeDetails) {
        throw new AppError("A plan with the same type and duration unit already exists", HttpStatus.BAD_REQUEST);
    }


    // Check if features are valid strings
    const invalidFeatures = subscriptionPlanDetails.features.filter(feature => typeof feature !== 'string');
    if (invalidFeatures.length > 0) {
        throw new AppError("Invalid feature(s) found", HttpStatus.BAD_REQUEST);
    }

    const newSubscriptionPlan = await Subscription.create(subscriptionPlanDetails);
    res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, newSubscriptionPlan,'plan is created'))
})
