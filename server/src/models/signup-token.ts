import { ObjectId } from "mongodb";
import mongoose, { Schema, SchemaType } from "mongoose";



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

const signup_token = mongoose.model('token', tokenSchema);

export default signup_token;