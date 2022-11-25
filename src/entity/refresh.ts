import {model, Schema, Document, Types} from 'mongoose'

const schema = new Schema(
    {
        token: {type: String, required: true},
        created_at: {type: Date, required: true},
        expires_at: {type: Date, required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    },
    {versionKey: false},
);

export interface IRefresh extends Document {
    _id: Types.ObjectId;
    id: string;
    token: string;
    created_at: Date;
    expires_at:  Date;
    user: Types.ObjectId;
}

const RefreshModel = model<IRefresh>('Refresh', schema);

export type RefreshModelType = typeof RefreshModel;

export default RefreshModel;

