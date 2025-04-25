import { Schema, model } from "mongoose";

const reasonSchema = new Schema({
  title: String,
}, { timestamps: true });


export const ReasonModel = model('reason', reasonSchema);