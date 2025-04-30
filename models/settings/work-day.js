import { Schema, model } from "mongoose";

const workDaySchema = new Schema({
  title: String,
  date: Date
}, { timestamps: true });

workDaySchema.index({ date: 1 });


export const WorkDayModel = model('work_day', workDaySchema);