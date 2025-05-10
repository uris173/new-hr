import Joi from 'joi';
import { Types } from "mongoose";

export const EventQueryFilter = (data) => Joi.object({
  type: Joi.string()
    .valid('face', 'card')
    .optional()
    .allow(null, "")
    .messages({
      'string.base': 'eventTypeBase',
      'any.only': 'eventTypeOnly',
    }),

  user: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message('eventUserCustom');
      }
      return value;
    })
    .optional()
    .allow(null, "")
    .messages({
      'string.base': 'eventUserBase',
    }),

  branch: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message('eventBranchCustom');
      }
      return value;
    })
    .optional()
    .allow(null, "")
    .messages({
      'string.base': 'eventBranchBase',
    }),

  door: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message('eventDoorCustom');
      }
      return value;
    })
    .optional()
    .allow(null, "")
    .messages({
      'string.base': 'eventDoorBase',
    }),
  
  department: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("eventDepartmentCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "eventDepartmentBase",
    }),

  limit: Joi.number()
    .valid(0, 1, 30, 50, 100)
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