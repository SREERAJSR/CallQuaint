import { Document, Types } from 'mongoose';

export interface CallInfoModel extends Document {
    userId: Types.ObjectId;
    callInfo: {
        remoteUserId: Types.ObjectId;
        callDuration: string;
    }[];
}
