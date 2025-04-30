import { Schema, model } from "mongoose";

const staffPositionSchema = new Schema({
  title: String
}, { timestamps: true });

staffPositionSchema.index({ title: 1 });


export const StaffPositionModel = model('staff_position', staffPositionSchema);