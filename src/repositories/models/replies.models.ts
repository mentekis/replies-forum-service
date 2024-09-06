import { model, Schema } from 'mongoose';

const schema = new Schema({
    body: String,
    threadId: String,
    user: { type: Schema.Types.String, ref: "User" },
})

export const entity = model("Replies", schema);