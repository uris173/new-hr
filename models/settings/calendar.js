import { Types, Schema, model } from "mongoose";

const calendarSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user"
  },
  date: Date,
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night', 'full_day', 'off'],
    default: 'off'
  },
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned',
  },
  notes: String
}, { timestamps: true });

calendarSchema.index({ user: 1, date: 1 }, { unique: true });
calendarSchema.index({ user: 1 });
calendarSchema.index({ date: 1 });
calendarSchema.index({ status: 1 });


export const CalendarModel = model('calendar', calendarSchema);