import Joi from "joi";
import { Types } from "mongoose";

export const UserQueryFilter = (data) => Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.empty': 'userFullNameBase',
      'string.min': 'userFullNameMin',
      'string.max': 'userFullNameMax',
    }),

  role: Joi.string()
    .valid('boss', 'chief', 'worker', 'guest')
    .messages({
      'any.only': 'Роль должна быть одной из: boss, chief, worker, guest.',
      'string.empty': 'Роль не может быть пустой.'
    }),

  department: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("userDepartmentCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "userDepartmentBase",
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

export const UserCreate = (data) => Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'userFullNameBase',
      'string.min': 'userFullNameMin',
      'string.max': 'userFullNameMax',
      'any.required': 'userFullNameRequired'
    }),
  
  phone: Joi.string()
    .pattern(/^998 \((90|91|93|94|95|97|98|99|33|88|50|77)\) \d{3}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.empty': 'phoneEmpty',
      'string.pattern.base': 'phonePattern',
      'any.required': 'phoneRequired'
    }),
  
  password: Joi.string()
    .min(5)
    .max(50)
    .required()
    .messages({
      'string.empty': 'passwordEmpty',
      'string.min': 'passwordMin',
      'string.max': 'passwordMax',
      'any.required': 'passwordRequired'
    }),
  
  role: Joi.string()
    .valid("boss", "chief", "worker", "guest")
    .required()
    .messages({
      'any.only': 'userRoleOnly',
      'any.required': 'userRoleRequired'
    }),
    
    faceUrl: Joi.string()
    .required()
    .messages({
      "string.base": "userFaceUrl",
      'any.required': 'userFaceUrlRequired'
    }),
  
  department: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("userDepartmentCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "userDepartmentBase",
    }),
  
  workTime: Joi.array().items(
    Joi.object({
      day: Joi.number().integer().min(0).max(6).required()
        .messages({
          'number.base': 'userWorkTimeDayBase',
          'number.min': 'userWorkTimeDayMin',
          'number.max': 'userWorkTimeDayMax',
          'any.required': 'userWorkTimeDayRequired'
        }),
      startTime: Joi.date().required().messages({
        'date.base': 'userWorkTimeStartTimeStartTimeBase',
        'any.required': 'userWorkTimeStartTimeRequired'
      }),
      endTime: Joi.date().greater(Joi.ref('startTime')).required().messages({
        'date.base': 'userWorkTimeEndTimeBase',
        'date.greater': 'userWorkTimeEndTimeGreater"',
        'any.required': 'userWorkTimeEndTimeRequired'
      })
    })
  ),
  
  sync: Joi.array().items(
    Joi.object({
      ip: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required()
        .messages({
          'string.ip': 'userSyncIp',
          'any.required': 'userSyncIpRequired'
        }),
      type: Joi.number().valid(0, 1).required()
        .messages({
          'number.base': 'userSyncTypeBase',
          'any.only': 'userSyncTypeOnly',
          'any.required': 'userSyncTypeRequired'
        }),
      status: Joi.boolean().messages({
        'boolean.base': 'userSyncStatusBase'
      })
    })
  )
}).validate(data);

export const UserUpdate = (data) => Joi.object({
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

  fullName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'userFullNameBase',
      'string.min': 'userFullNameMin',
      'string.max': 'userFullNameMax',
      'any.required': 'userFullNameRequired'
    }),
  
  phone: Joi.string()
    .pattern(/^998 \((90|91|93|94|95|97|98|99|33|88|50|77)\) \d{3}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.empty': 'phoneEmpty',
      'string.pattern.base': 'phonePattern',
      'any.required': 'phoneRequired'
    }),
  
  password: Joi.string()
    .min(5)
    .max(50)
    .required()
    .messages({
      'string.empty': 'passwordEmpty',
      'string.min': 'passwordMin',
      'string.max': 'passwordMax',
      'any.required': 'passwordRequired'
    }),
  
  role: Joi.string()
    .valid("boss", "chief", "worker", "guest")
    .required()
    .messages({
      'any.only': 'userRoleOnly',
      'any.required': 'userRoleRequired'
    }),
    
    faceUrl: Joi.string()
    .required()
    .messages({
      "string.base": "userFaceUrl",
      'any.required': 'userFaceUrlRequired'
    }),
  
  department: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("userDepartmentCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "userDepartmentBase",
    }),
  
  workTime: Joi.array().items(
    Joi.object({
      day: Joi.number().integer().min(0).max(6).required()
        .messages({
          'number.base': 'userWorkTimeDayBase',
          'number.min': 'userWorkTimeDayMin',
          'number.max': 'userWorkTimeDayMax',
          'any.required': 'userWorkTimeDayRequired'
        }),
      startTime: Joi.date().required().messages({
        'date.base': 'userWorkTimeStartTimeStartTimeBase',
        'any.required': 'userWorkTimeStartTimeRequired'
      }),
      endTime: Joi.date().greater(Joi.ref('startTime')).required().messages({
        'date.base': 'userWorkTimeEndTimeBase',
        'date.greater': 'userWorkTimeEndTimeGreater"',
        'any.required': 'userWorkTimeEndTimeRequired'
      })
    })
  ),
  
  sync: Joi.array().items(
    Joi.object({
      ip: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required()
        .messages({
          'string.ip': 'userSyncIp',
          'any.required': 'userSyncIpRequired'
        }),
      type: Joi.number().valid(0, 1).required()
        .messages({
          'number.base': 'userSyncTypeBase',
          'any.only': 'userSyncTypeOnly',
          'any.required': 'userSyncTypeRequired'
        }),
      status: Joi.boolean().messages({
        'boolean.base': 'userSyncStatusBase'
      })
    })
  )
}).validate(data);