import { Types, Schema, model } from "mongoose";

const internalNumberSchema = new Schema({
  department: {
    type: Types.ObjectId,
    ref: "department",
  },
  user: {
    type: Types.ObjectId,
    ref: "user",
  },
  title: String,
  phone: String,
}, { timestamps: true });


export const InternalNumModel = model("internal_number", internalNumberSchema);