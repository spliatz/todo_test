import {model, Schema} from 'mongoose'

const schema = new Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        created_at: {type: Date, required: true},
        updated_at: {type: Date, required: true},
        author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {versionKey: false},
);

export default model('Todo', schema);