import mongoose from "mongoose";
import { CallInfoModel } from "../types/callinfomodel.type";

export const callInfoSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        callInfo: [{
            remoteUserId: {
                type: mongoose.Types.ObjectId,
                ref: 'User', 
            },
            callDuration: {
                type:String,
                required: true
            }
        }]
    });


const CallInfo = mongoose.model<CallInfoModel>('callInformation', callInfoSchema)
export default CallInfo;