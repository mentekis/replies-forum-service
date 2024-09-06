import { model, Schema } from "mongoose";

const schema = new Schema({
    _id: String,
    name: String,
}, { _id: false });

export const entity = model("User", schema);