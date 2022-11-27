import { model, Schema, Document, Types } from 'mongoose'

interface IRefresh {
  _id: Types.ObjectId
  id: string
  token: string
  created_at: Date
  expires_at: Date
  user: Types.ObjectId
}

const schema = new Schema<IRefresh>(
  {
    token: { type: String, required: true },
    created_at: { type: Date, required: true },
    expires_at: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { versionKey: false }
)

const RefreshModel = model<IRefresh>('Refresh', schema)

export type RefreshDocument = IRefresh & Document
export type RefreshModelType = typeof RefreshModel

export default RefreshModel
