import { Types, Schema, model } from "mongoose";

const eventSchema = new Schema({
  type: {
    type: String,
    enum: ["face", "card"]
  },
  time: Date,
  user: {
    type: Types.ObjectId,
    ref: "user"
  },
  door: {
    type: Types.ObjectId,
    ref: "door"
  },
  // branch: String,
  employeeNoString: String,
  serialNo: Number,
  pictureURL: String,
}, { timestamps: true });

eventSchema.index({ user: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ time: 1 });
eventSchema.index({ door: 1 });


export const EventModel = model('event', eventSchema);