import { NextFunction, Request, Response } from "express";
import asyncHandler = require("express-async-handler");
import User from "../models/user.model";
import AppError from "../utils/AppError";
import HttpStatus from "../types/constants/http-statuscodes";
import { UserRolesEnum } from "../types/constants/common.constant";
import { generateAcessTokenAndrefreshToken } from "../services/user.services";
import mongoose, { mongo } from "mongoose";
import ApiResponse from "../utils/ApiReponse";
import Order from "../models/subscriptionorder.model";
import CallInfo from "../models/callInfo.model";
import { IsubscriptionPlanRequestBody } from "../types/model/subscriptionmodel.interface";
import { Subscription } from "../models/subscription.model";
import { refreshAccessToken } from "./user.controller";


export const getAllUsersData = async () => {
    try {
        const users = await User.find({},'firstname lastname email subscription avatar _id')
        return users
        
    } catch (error:any) {
        console.log(error);
        throw new AppError(error.message,HttpStatus.INTERNAL_SERVER_ERROR)
    }

}
export const loginAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string, password: string } = req.body;

    const user = await User.findOne({ email: email })
    if (!user) {
        throw new AppError("Admin doesnt exist with this email", HttpStatus.NOT_FOUND)
        return
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED)
        return
    }
    if (user.role !== UserRolesEnum.ADMIN) {
        throw new AppError("Entered information is not admins", HttpStatus.UNAUTHORIZED);
        return   
    }
    const { accessToken, refreshToken } = await generateAcessTokenAndrefreshToken(user._id)
    const loggedInAdmin = await User.findById(new mongoose.Types.ObjectId(user._id)).select('email firstname role,');
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, { admin: loggedInAdmin, accessToken: accessToken, refreshToken: refreshToken }, 'Admin loggin sucessfully')
)});


export const fetchDashBoardData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const usersCount = await User.aggregate([
        {
            $count:"totalUser"
        }
    ])
    const totalUsers = usersCount.length > 0 ? usersCount[0].totalUser : 0;

    const sucessOrders = await Order.aggregate([
        {
            $match:{"paymentStatus":"success"}
        },
        {
            $count:"sucessOrdersCount"
        }
    ])
    const sucessOrdersCount = sucessOrders.length > 0 ? sucessOrders[0].sucessOrdersCount : 0;

    const subscribedUsers = await User.aggregate([
        {
            $match:{"subscription":true}
        },
        {
            $count:"totalSubscribersCount"
        }
    ])
    const currentSubscribersCount :number= subscribedUsers.length > 0 ? subscribedUsers[0].totalSubscribersCount : 0;

    const randomCalls = await CallInfo.aggregate([
        {
            $count:"randomCallsCount"
        }
    ])

    const randomCallsCount = randomCalls.length > 0 ? randomCalls[0].randomCallsCount : 0;

     const salesData = await Order.aggregate([
    {
      $match: { paymentStatus: 'success' }
    },
    {
      $group: {
        _id: { $month: "$createdAt".toString() },
        totalSales: { $sum: "$amount" }
      }
    },
    {
      $sort: { _id: 1 } // Ensure the data is sorted by month
    }
     ]);
    
    const salesByMonth = Array(12).fill(0);
    salesData.forEach((item) => {
        salesByMonth[item._id -1] = item.totalSales
    })


    const premiumUsers = currentSubscribersCount;
    const normalUsers = Math.abs(totalUsers - currentSubscribersCount);
    

    const last5subscribedUsers = await User.aggregate([
        { $match: { 'subscription': true } },
        { $sort: { updatedAt: -1 } },
        { $limit: 5 },
        {
            $project: {
                email: 1,
                firstname: 1,
                avatar: 1,
                _id: 1,
                subscriptionId: 1,
                subscriptionEndDate: 1
        }
        },
        {
            $lookup: {
                from: "subscriptions",
                foreignField: "_id",
                localField: "subscriptionId",
                as: 'subscriptionDetails',
            }
        }, {
            $addFields: {
                subscriptionDetails:{$first:"$subscriptionDetails"}
            }
        }
    ])
    

    
    const payload = {
        totalUsers: totalUsers,
        successOrdersCount: sucessOrdersCount,
        currentSubscribersCount: currentSubscribersCount,
        randomCallsCount: randomCallsCount,
        salesByMonth: salesByMonth,
        normalUsers: normalUsers,
        last5subscribedUsers:last5subscribedUsers
    }
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK,payload,"sucess"))


})

export const fetchAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const usersData = await getAllUsersData()
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK,usersData,"fetched users data sucessfully"))
})


export const blockUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const user = await User.findById(new mongoose.Types.ObjectId(userId))
    if (!user) {
        throw new AppError("User with this userId doesnot exist", HttpStatus.NOT_FOUND);
        return;
    }
    if (user.isBlocked === true) {
        throw new AppError("This user is already blocked", HttpStatus.BAD_REQUEST)
        return
    }

    const blockedUser = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), {isBlocked:true
    }, { new: true }).select('firstname lastname email isBlocked role  gender avatar')
    if (!blockUser) {
        throw new AppError("Error in blocking the user", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, blockUser, 'sucessfully blocked the user'));

})



export const createSubscriptionPlan = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
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

export const getAllSubscriptonPlans = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const subscriptionPlans = await Subscription.find();
    if (!subscriptionPlans) {
        throw new AppError("Subscription plans doesnot exist ", HttpStatus.NOT_FOUND)
        return 
    }

    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, subscriptionPlans, "fetched subscriptions plans sucessfully"));
})


export const fetchSalesReports = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { period } = req.params;

    let groupBy;
    let dateFormat;

    if (period === 'week') {
        groupBy = {
            year: { $year: "$createdAt" },
            week:{$week:"$createdAt"}
        }
         dateFormat = {
      $dateToString: { format: "%Y-%U", date: "$createdAt" }
    };
    } else if (period === 'month') {
        groupBy = {
            year: { $year: "$createdAt" },
            month:{$month:"$createdAt"}
        }
         dateFormat = {
      $dateToString: { format: "%Y-%m", date: "$createdAt" }
    };
    } else if (period === 'year') {
        groupBy = {
            year: { $year: '$createdAt' }
        }
          dateFormat = {
      $dateToString: { format: "%Y", date: "$createdAt" }
    };
    } else {
        throw new AppError("Invalid period",HttpStatus.BAD_REQUEST)
    }

    const salesReport = await Order.aggregate([
        {
            $group: {
                _id: groupBy,
                totalSales: { $sum: "$amount" },
                count: { $sum: 1 },
                details:{$push:"$$ROOT"}
            }
        }, {
            $sort:{"_id.year":1,"_id.month":1,"_id.week":1}
        }
    ])
    console.log(salesReport);

    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK,salesReport,'Succesfully fetched the sales report'))
})


export const logoutAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const _id = 'dummy Id';


    const user = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_id), {
        $set: {
            refreshAccessToken:undefined
        }
    }, { new: true })
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, {}, "admin logout succesfully"));
})