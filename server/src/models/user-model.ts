import mongoose  from "mongoose";
import { UserDocument, UserModel } from "../types/schema.types";


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowerCase:true,
        required: true,
    },
    gender: {
        type: String,
        required:true
    },
    password:{
        type: String,
        unique: true,
        required:true
    },
    verified: {
    type: Boolean,
    default: false
    }
})

userSchema.index({})

const User = mongoose.model<UserDocument, UserModel>('user', userSchema)

export default User;


