import {model, Schema, Document, Types} from 'mongoose'

const schema = new Schema(
    {
        name: {type: String, required: true},
        password: {type: String, required: true},
        email: {type: String, required: true, unique: true},
    },
    {versionKey: false},
);

export interface IUser extends Document {
    _id: Types.ObjectId;
    id: string;
    name: string;
    password: string;
    email: string;
}

const User = model<IUser>('User', schema);

export type UserModelType = typeof User;

export default User;