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
    .valid('boss', 'chief', 'worker', "security", 'guest')
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

  status: Joi.string()
    .valid("active", "inactive", "deleted")
    .default("active")
    .messages({
      "string.base": "statusBase",
      "any.only": "statusBase"
    }),

  pick: Joi.string().optional(),

  users: Joi.array()
    .items(
      Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
          return helpers.message("userIdCustom");
        }
        return value;
      })
        .allow(null, "")
        .messages({
          "string.base": "userIdBase",
        })
    )
    .messages({
      "array.base": "userIdArrayBase",
      "array.includes": "userIdArrayIncludes",
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
    .valid("boss", "chief", "worker", "security", "security", "guest")
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

  gender: Joi.string()
    .valid("male", "female", "custom")
    .required()
    .messages({
      "string.base": "userGenderBase",
      "any.only": "userGenderBase",
      "any.required": "userGenderRequired",
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

  doors: Joi.array().items(
    Joi.string().custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("userDoorsCustom");
      }
      return value;
    })
    .allow(null, "")
    .messages({
      "string.base": "userDoorsBase"
    })
  )
    
  
  // sync: Joi.array().items(
  //   Joi.object({
  //     ip: Joi.string().ip({ version: ['ipv4'], cidr: "forbidden" }).required()
  //       .messages({
  //         'string.ip': 'userSyncIp',
  //         "string.ipVersion": "userSyncIpv4",
  //         'any.required': 'userSyncIpRequired'
  //       }),
  //     type: Joi.number().valid(0, 1).required()
  //       .messages({
  //         'number.base': 'userSyncTypeBase',
  //         'any.only': 'userSyncTypeOnly',
  //         'any.required': 'userSyncTypeRequired'
  //       }),
  //     status: Joi.boolean().messages({
  //       'boolean.base': 'userSyncStatusBase'
  //     })
  //   })
  // )
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
    .allow(null, "")
    .messages({
      'string.min': 'passwordMin',
      'string.max': 'passwordMax',
    }),
  
  role: Joi.string()
    .valid("boss", "chief", "worker", "security", "guest")
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

  gender: Joi.string()
    .valid("male", "female", "custom")
    .required()
    .messages({
      "string.base": "userGenderBase",
      "any.only": "userGenderBase",
      "any.required": "userGenderRequired",
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

  doors: Joi.array().items(
    Joi.string().custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("userDoorsCustom");
      }
      return value;
    })
      .allow(null, "")
      .messages({
        "string.base": "userDoorsBase"
      })
  )
  
  // sync: Joi.array().items(
  //   Joi.object({
  //     ip: Joi.string().ip({ version: ['ipv4'], cidr: "forbidden" }).required()
  //       .messages({
  //         'string.ip': 'userSyncIp',
  //         "string.ipVersion": "userSyncIpv4",
  //         'any.required': 'userSyncIpRequired'
  //       }),
  //     type: Joi.number().valid(0, 1).required()
  //       .messages({
  //         'number.base': 'userSyncTypeBase',
  //         'any.only': 'userSyncTypeOnly',
  //         'any.required': 'userSyncTypeRequired'
  //       }),
  //     status: Joi.boolean().messages({
  //       'boolean.base': 'userSyncStatusBase'
  //     })
  //   })
  // )
}).validate(data);

export const AddUserCalendar = (data) => Joi.object({
  user: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("calendarUserCustom");
      }
      return value;
    })
    .allow(null, "")
    .required()
    .messages({
      "string.base": "calendarUserBase",
      "any.required": "calendarUserRequired"
    }),

  date: Joi.date()
    .required()
    .messages({
      "date.base": "calendarDateBase",
      "any.required": "calendarDateRequired"
    }),

  shift: Joi.string()
    .valid('morning', 'afternoon', 'night', 'full_day', 'off')
    .required()
    .messages({
      "string.base": "calendarShiftBase",
      "any.only": "calendarShiftOnly",
      "any.required": "calendarShiftRequired"
    }),

  notes: Joi.string()
    .max(255)
    .messages({
      "string.base": "calendarNotesBase",
      "string.max": "calendarNotesMax"
    })
}).validate(data);

export const UpdateUserCalendar = (data) => Joi.object({
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

  user: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message("calendarUserCustom");
      }
      return value;
    })
    .allow(null, "")
    .required()
    .messages({
      "string.base": "calendarUserBase",
      "any.required": "calendarUserRequired"
    }),

  date: Joi.date()
    .required()
    .messages({
      "date.base": "calendarDateBase",
      "any.required": "calendarDateRequired"
    }),

  shift: Joi.string()
    .valid('morning', 'afternoon', 'night', 'full_day', 'off')
    .required()
    .messages({
      "string.base": "calendarShiftBase",
      "any.only": "calendarShiftOnly",
      "any.required": "calendarShiftRequired"
    }),

  notes: Joi.string()
    .max(255)
    .messages({
      "string.base": "calendarNotesBase",
      "string.max": "calendarNotesMax"
    })
}).validate(data); 