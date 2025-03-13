import { Schema, model } from "mongoose";

const staffPositionSchema = new Schema({
  title: String
}, { timestamps: true });


export const StaffPositionModel = model('staff_position', staffPositionSchema);