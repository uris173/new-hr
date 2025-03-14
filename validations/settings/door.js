import Joi from "joi";
import { Types } from "mongoose";

export const DoorQueryFilter = (data) => Joi.object({
  title: Joi.string()
    .min(2)
    .max(150)
    .message({
      "string.base": "doorTitleBase",
      "string.empty": "doorTitleEmpty",
      "string.min": "doorTitleMin",
      "string.max": "doorTitleMax",
    }),

  limit: Joi.number()
    .valid(1, 30, 50, 100)
    .optional()
    .messages({
      "number.base": "limitBase",
      "any.only": "limitOnly",
    }),
  page: Joi.number()
    .optional()
    .messages({
      "number.base": "pageBase",
      "number.integer": "pageinteger",
      "number.positive": "pagePositive"
    })
}).validate(data);

export const CreateDoor = (data) => Joi.object({
  title: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      "any.required": "doorTitleRequired",
      "string.base": "doorTitleBase",
      "string.empty": "doorTitleEmpty",
      "string.min": "doorTitleMin",
      "string.max": "doorTitleMax",
    }),
    
    ip: Joi.string()
    .ip({ version: ["ipv4"] })
    .required()
    .messages({
      "any.required": "doorIpRequired",
      "string.base": "doorIpBase",
      "string.empty": "doorIpEmpty",
      "string.ip": "doorIpIp",
      "string.ipv4": "doorIpIpv4",
      "string.ipVersion": "doorIpIpv4",
    }),
}).validate(data);

export const UpdateDoor = (data) => Joi.object({
  _id: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("_idCustom");
      }
      return value;
    })
    .required()
    .messages({
      "string.base": "_idBase",
      "any.required": "_idRequired"
    }),

  title: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      "any.required": "doorTitleRequired",
      "string.base": "doorTitleBase",
      "string.empty": "doorTitleEmpty",
      "string.min": "doorTitleMin",
      "string.max": "doorTitleMax",
    }),
    
    ip: Joi.string()
    .ip({ version: ["ipv4"] })
    .required()
    .messages({
      "any.required": "doorIpRequired",
      "string.base": "doorIpBase",
      "string.empty": "doorIpEmpty",
      "string.ip": "doorIpIp",
      "string.ipv4": "doorIpIpv4",
      "string.ipVersion": "doorIpIpv4",
    }),
}).validate(data);