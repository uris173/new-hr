import { Schema, model } from "mongoose";

const reasonSchema = new Schema({
  title: String,
}, { timestamps: true });

reasonSchema.index({ title: 1 });


export const ReasonModel = model('reason', reasonSchema);