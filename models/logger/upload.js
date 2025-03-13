import { Types, Schema, model} from "mongoose";

const uploadSchema = new Schema({
  filename: String,
  user: {
    type: Types.ObjectId,
    ref: "user",
  }
}, { timestamps: true });


export const Upload = model("upload", uploadSchema);