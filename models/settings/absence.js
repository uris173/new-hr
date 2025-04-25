import { Types, Schema, model } from "mongoose";

const absenceSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
  },
  reason: {
    type: Types.ObjectId,
    ref: "reason",
  },
  title: String,
  description: String,
  doc: [],
  start: Date,
  end: Date
}, { timestamps: true });


export const AbsenceModel = model("absence", absenceSchema);