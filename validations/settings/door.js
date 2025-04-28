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
    .required()
    .messages({
      "any.required": "doorIpRequired",
      "string.base": "doorIpBase",
      "string.empty": "doorIpEmpty",
      "string.ip": "doorIpIp",
      "string.ipv4": "doorIpIpv4",
      "string.ipVersion": "doorIpIpv4",
    }),

  port: Joi.string()
    .required()
    .messages({
      "any.required": "doorPortRequired",
      "string.base": "doorPortBase",
      "string.empty": "doorPortEmpty",
    }),

  type: Joi.string()
    .valid("exit", "enter")
    .required()
    .messages({
      "any.required": "doorTypeRequired",
      "string.base": "doorTypeBase",
      "any.only": "doorTypeOnly",
    }),
  
  login: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]"))
    .min(3)
    .max(50)
    .required()
    .messages({
      "any.pattern": "doorLoginPattern",
      "any.required": "doorLoginRequired",
      "string.base": "doorLoginBase",
      "string.min": "doorLoginMin",
      "string.max": "doorLoginMax",
    }),
  
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]"))
    .min(3)
    .max(50)
    .required()
    .messages({
      "any.pattern": "doorPasswordPattern",
      "any.required": "doorPasswordRequired",
      "string.base": "doorPasswordBase",
      "string.min": "doorPasswordMin",
      "string.max": "doorPasswordMax",
    }),

  isOpen: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "doorIsOpenBase"
    })
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
    .required()
    .messages({
      "any.required": "doorIpRequired",
      "string.base": "doorIpBase",
      "string.empty": "doorIpEmpty",
      "string.ip": "doorIpIp",
      "string.ipv4": "doorIpIpv4",
      "string.ipVersion": "doorIpIpv4",
    }),

  port: Joi.string()
    .required()
    .messages({
      "any.required": "doorPortRequired",
      "string.base": "doorPortBase",
      "string.empty": "doorPortEmpty",
    }),

  type: Joi.string()
    .valid("exit", "enter")
    .required()
    .messages({
      "any.required": "doorTypeRequired",
      "string.base": "doorTypeBase",
      "any.only": "doorTypeOnly",
    }),

  login: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]"))
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "doorLoginPattern",
      "any.required": "doorLoginRequired",
      "string.base": "doorLoginBase",
      "string.min": "doorLoginMin",
      "string.max": "doorLoginMax",
    }),
  
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]"))
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "doorPasswordPattern",
      "any.required": "doorPasswordRequired",
      "string.base": "doorPasswordBase",
      "string.min": "doorPasswordMin",
      "string.max": "doorPasswordMax",
    }),

  isOpen: Joi.boolean()
    .optional()
    .messages({
      "boolean.base": "doorIsOpenBase"
    })
}).validate(data);