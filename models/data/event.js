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


export const EventModel = model('event', eventSchema);