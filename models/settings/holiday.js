import { Schema, model } from "mongoose";

const holidaySchema = new Schema({
  title: String,
  date: Date
}, { timestamps: true });

holidaySchema.index({ date: 1 });


export const HolidayModel = model('holiday', holidaySchema);