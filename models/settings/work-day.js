import { Schema, model } from "mongoose";

const workDaySchema = new Schema({
  title: String,
  date: Date
}, { timestamps: true });


export const WorkDayModel = model('work_day', workDaySchema);