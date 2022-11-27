import { model, Schema, Document, Types } from 'mongoose'

interface IUser {
  _id: Types.ObjectId
  id: string
  name: string
  password: string
  email: string
}

const schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { versionKey: false }
)

const User = model<IUser>('User', schema)

export type UserDocument = IUser & Document
export type UserModelType = typeof User

export default User
