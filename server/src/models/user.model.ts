import mongoose, { mongo }  from "mongoose";
import { AvailableSocialLogins, SocialLoginEnums, USER_TEMPORARY_TOKEN_EXPIRY, UserRolesEnum, availableUserRoles } from "../types/constants/common.constant";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configKey from "../configs/configkeys";
import crypto from 'node:crypto';
import { TemporaryToken, UserDocument } from "../types/usermodel.types";
import uuid from 'uuid';


const userSchema = new mongoose.Schema({
   
    avatar: {   
        type: String,
        default: 'https://via.placeholder.com/200x200.png'
},
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowerCase: true,
        trim: true,
        required: true,
    },
    role: {
        type: String,
        enum: availableUserRoles,
        default: UserRolesEnum.USER,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    channelName: {
        type: String,
        unique: true,
        required: true,
        default:()=> generateChannelName()
    },
    loginType: {
        type: String,
        enum: AvailableSocialLogins,
        default:SocialLoginEnums.EMAIL_PASSWORD
    },
    isEmailVerified: {
    type: Boolean,
    default: false
    },
    refreshToken: {
       type:String 
    },
    forgotPasswordToken: {
        type:String
    },
    forgotPasswordExpiry: {
        type:Date
    },
    emailVerificationToken: {
        type:String
    },
    emailVerificationExpiry: {
        type:Date
    },
    expireAt: {
        type: Date,
        default: Date.now, // Automatically set to the current time
        index: true // Index to facilitate querying
    }
},{
        timestamps:true
    })



userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password: string) {
    return bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = async function ():Promise<string> {
    return jwt.sign(
        {
            _id: this._id,
            firstname: this.firstname,
            email: this.email,
            role:this.role
        },
        configKey().ACCESS_TOKEN_SECRET,
        {expiresIn:configKey().ACCESS_TOKEN_EXPIRY}
)
}

userSchema.methods.generateRefreshToken = async function ():Promise<string>{
    return jwt.sign(
        {
            _id:this._id
        },
        configKey().REFRESH_TOKEN_SECRET,
        {expiresIn:configKey().REFRESH_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateTemporaryToken = async function ():Promise<TemporaryToken> {
    const unHashedToken = crypto.randomBytes(20).toString("hex") as string;
    const hashedToken = crypto.createHash('sha256').update(unHashedToken).digest('hex') as string;
    const tokenExpiry = new Date(Date.now() + USER_TEMPORARY_TOKEN_EXPIRY) as Date;
    return {
        unHashedToken ,
        hashedToken,
        tokenExpiry
    }
}

function generateChannelName(){
return `channel${crypto.randomUUID()}`
}
 const User = mongoose.model<UserDocument>('user', userSchema)    

export default User;


