import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import {
  all,
  create,
  getOne,
  changeStatus,
  update,
  remove
} from "../../controllers/data/user.js";

router.route('/')
.all(passport.authenticate('jwt', { session: false }), top)
.get(all)
.post(create)
.put(update);

router.get('/status/:id', passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top, changeStatus);

router.route('/:id')
.all(passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top)
.get(getOne)
.delete(remove);


export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор пользователя
 *         fullName:
 *           type: string
 *           description: Полное имя пользователя
 *         phone:
 *           type: string
 *           description: Номер телефона пользователя
 *         role:
 *           type: string
 *           enum: ["admin", "boss", "chief", "worker", "security", "guest"]
 *           description: Роль пользователя
 *         faceUrl:
 *           type: string
 *           description: URL изображения лица пользователя
 *         gender:
 *           type: string
 *           enum: ["male", "female", "custom"]
 *           description: Пол сотрудника
 *         department:
 *           type: string
 *           description: ID отдела (ссылка на модель Department) или null
 *         workTime:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: integer
 *                 description: День недели (0 - воскресенье, 6 - суббота)
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Время начала работы
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Время окончания работы
 *           description: Рабочее время пользователя
 *         doors:
 *           type: array
 *           items:
 *             type: string
 *             description: ID дверей (ссылка на модель Door)
 *         employeeNo:
 *           type: string
 *           description: Номер сотрудника
 *         sync:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               ip:
 *                 type: string
 *                 description: IP-адрес
 *               type:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Тип синхронизации (0 - выход, 1 - вход)
 *               status:
 *                 type: boolean
 *                 description: Статус синхронизации
 *           description: Данные синхронизации
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "deleted"]
 *           description: Статус пользователя
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания пользователя
 *       required:
 *         - fullName
 *         - phone
 *         - password
 *         - role
 *         - faceUrl
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreateRequest:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: Полное имя пользователя
 *         phone:
 *           type: string
 *           description: Номер телефона пользователя (формат "998 (90) 123-45-67")
 *         password:
 *           type: string
 *           description: Пароль пользователя
 *         role:
 *           type: string
 *           enum: ["boss", "chief", "worker", "security", "guest"]
 *           description: Роль пользователя
 *         faceUrl:
 *           type: string
 *           description: URL изображения лица пользователя
 *         gender:
 *           type: string
 *           enum: ["male", "female", "custom"]
 *           description: Пол сотрудника
 *         department:
 *           type: string
 *           description: ID отдела (ссылка на модель Department) или null
 *         workTime:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: integer
 *                 description: День недели (0 - воскресенье, 6 - суббота)
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Время начала работы
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Время окончания работы
 *           description: Рабочее время пользователя
 *         doors:
 *           type: array
 *           items:
 *             type: string
 *             description: ID дверей (ссылка на модель Door)
 *       required:
 *         - fullName
 *         - gender
 *         - phone
 *         - password
 *         - role
 *         - faceUrl
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор пользователя
 *         fullName:
 *           type: string
 *           description: Полное имя пользователя
 *         phone:
 *           type: string
 *           description: Номер телефона пользователя (формат "998 (90) 123-45-67")
 *         password:
 *           type: string
 *           description: Пароль пользователя
 *         role:
 *           type: string
 *           enum: ["boss", "chief", "worker", "security", "guest"]
 *           description: Роль пользователя
 *         faceUrl:
 *           type: string
 *           description: URL изображения лица пользователя
 *         gender:
 *           type: string
 *           enum: ["male", "female", "custom"]
 *           description: Пол сотрудника
 *         department:
 *           type: string
 *           description: ID отдела (ссылка на модель Department) или null
 *         workTime:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: integer
 *                 description: День недели (0 - воскресенье, 6 - суббота)
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Время начала работы
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Время окончания работы
 *           description: Рабочее время пользователя
 *         doors:
 *           type: array
 *           items:
 *             type: string
 *             description: ID дверей (ссылка на модель Door)
 *       required:
 *         - _id
 *         - gender
 *         - fullName
 *         - phone
 *         - password
 *         - role
 *         - faceUrl
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Получение списка пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Фильтр по полному имени пользователя (регистронезависимый)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: ["boss", "chief", "worker", "security", "guest"]
 *         description: Фильтр по роли пользователя
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Фильтр по ID отдела
 *       - in: query
 *         name: employeeNo
 *         schema:
 *           type: string
 *         description: Фильтр по номеру сотрудника
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           enum: [30, 50, 100]
 *         description: Лимит записей на страницу (по умолчанию 30)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы (по умолчанию 1)
 *     responses:
 *       200:
 *         description: Успешный ответ со списком пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество пользователей
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации параметров запроса
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Создание нового пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации данных или недостаточно прав
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Обновление данных пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: Данные пользователя успешно обновлены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации данных или недостаточно прав
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /user/status/{id}:
 *   get:
 *     summary: Изменение статуса пользователя (active/inactive)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Статус пользователя успешно изменён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Пользователь не найден или статус не может быть изменён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "userNotFound"
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Получение данных пользователя по ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ с данными пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "userNotFound"
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Удаление пользователя (пометка как deleted)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь успешно помечен как удалённый
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "deleted"
 *       400:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "userNotFound"
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */