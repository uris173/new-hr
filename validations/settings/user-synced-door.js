import Joi from "joi";
import { Types } from "mongoose";

export const CreateUserSyncedDoor = (data) => Joi.object({
  user: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .required()
    .messages({
      "any.required": "userSyncedDoorUserRequired",
      "string.base": "userSyncedDoorUserBase",
    }),

  door: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .required()
    .messages({
      "any.required": "userSyncedDoorDoorRequired",
      "string.base": "userSyncedDoorDoorBase",
    }),
}).validate(data);