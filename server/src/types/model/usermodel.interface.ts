import mongoose,{Document, mongo} from "mongoose";


export interface TemporaryToken{
    unHashedToken: string, hashedToken: string, tokenExpiry: Date
}
export interface UserDocument extends Document {
    avatar: {
        String?: string | null | undefined;
        localPath?: string | null | undefined; 
    };
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    gender: string;
    password: string;
    loginType: string;
    isEmailVerified: boolean;
    refreshToken?: string;
    forgotPasswordToken?: string;
    forgotPasswordExpiry?: Date;
    emailVerificationToken?: string;
    emailVerificationExpiry?: Date;
    expireAt?: Date;
    channelName: string;
    requests: mongoose.Types.ObjectId[];
    friends: mongoose.Types.ObjectId[];
    requestSent: mongoose.Types.ObjectId[];
    
    // Define methods
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
    generateRefreshToken(): Promise<string>;
    generateTemporaryToken(): Promise<TemporaryToken>;
}


export interface GoogleAuthenticatedUserInterface {
  email:string,
firstName: string
id: string
idToken: string
lastName?:string
name?: string
photoUrl?:string
provider?:string
    
}


