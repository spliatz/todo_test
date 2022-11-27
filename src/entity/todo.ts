import { model, Schema, Types, Document } from 'mongoose'

interface ITodo {
  _id: Types.ObjectId
  id: string
  title: string
  description: string
  created_at: Date
  updated_at: Date
  author: Types.ObjectId
}

const schema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { versionKey: false }
)

const TodoModel = model<ITodo>('Todo', schema)

export type TodoDocument = ITodo & Document
export type TodoModelType = typeof TodoModel

export default TodoModel
