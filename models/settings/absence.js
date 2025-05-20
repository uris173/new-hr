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
  doc: String,
  start: Date,
  end: Date
}, { timestamps: true });

absenceSchema.index({ user: 1 });
absenceSchema.index({ start: 1 });
absenceSchema.index({ end: 1 });


export const AbsenceModel = model("absence", absenceSchema);