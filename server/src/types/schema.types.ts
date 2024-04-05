import { Model, Schema } from "mongoose";

export interface UserDocument extends Document {
    firstname: string;
    lastname: string;
    email: string;
    gender: string;
    mobile: string;
    password: string;
    verified:boolean
}

export interface UserModel extends Model<UserDocument>{ }


export interface TokenDocument extends Document{
    userId: Schema.Types.ObjectId,
    token:string
}

export interface TokenModel extends Model<TokenDocument>{ }

export enum validateItems{
    "REQUEST_BODY" = "REQUEST_BODY",
    "ROUTE_PARAMS" = "ROUTE_PARAMS",
    "QUERY_STRING" = "QUERY_STRING"
}
