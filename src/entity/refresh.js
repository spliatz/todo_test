import {model, Schema} from 'mongoose'

const schema = new Schema(
    {
        token: {type: String, required: true},
        created_at: {type: Date, required: true},
        expires_at: {type: Date, required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    },
    {versionKey: false},
);

export default model('Refresh', schema);