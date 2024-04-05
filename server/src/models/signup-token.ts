import { ObjectId } from "mongodb";
import mongoose, { Schema, SchemaType } from "mongoose";
import { TokenDocument, TokenModel } from "../types/schema.types";


const tokenSchema = new mongoose.Schema({
    userId:{
        type: Schema.ObjectId,
        ref: 'user',
        required:true        
    },
    token: {
        type: String,
        required:true
    }
})

const signup_token = mongoose.model<TokenDocument, TokenModel>('token', tokenSchema);

export default signup_token;