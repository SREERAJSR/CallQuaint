import mongoose,{Document} from "mongoose";


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
    password: string;
    loginType: string;
    isEmailVerified: boolean;
    refreshToken?: string;
    forgotPasswordToken?: string;
    forgotPasswordExpiry?: Date;
    emailVerificationToken?: string;
    emailVerificationExpiry?: Date;
    expireAt?: Date;
    
    // Define methods
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
    generateRefreshToken(): Promise<string>;
    generateTemporaryToken(): Promise<TemporaryToken>;
}