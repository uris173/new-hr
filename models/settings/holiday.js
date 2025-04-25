import { Schema, model } from "mongoose";

const holidaySchema = new Schema({
  title: String,
  date: Date
}, { timestamps: true });


export const HolidayModel = model('holiday', holidaySchema);