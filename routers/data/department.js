import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import {
  all,
  create,
  changeStatus,
  getOne,
  update,
  remove
} from "../../controllers/data/department.js";

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
 *     Department:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор отдела
 *         name:
 *           type: string
 *           description: Название отдела
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           description: Тип отдела (1 - Отдел, 2 - Группа)
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
 *           description: Рабочее время отдела
 *         parent:
 *           type: string
 *           description: ID родительского отдела (ссылка на модель Department) или null
 *         chief:
 *           type: string
 *           description: ID руководителя (ссылка на модель User) или null
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "deleted"]
 *           description: Статус отдела
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания отдела
 *       required:
 *         - name
 *         - type
 * 
 *     DepartmentCreateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Название отдела
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           description: Тип отдела (1 - Отдел, 2 - Группа)
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
 *           description: Рабочее время отдела
 *         parent:
 *           type: string
 *           description: ID родительского отдела (ссылка на модель Department) или null
 *         chief:
 *           type: string
 *           description: ID руководителя (ссылка на модель User) или null
 *       required:
 *         - name
 *         - type
 * 
 *     DepartmentUpdateRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор отдела
 *         name:
 *           type: string
 *           description: Название отдела
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           description: Тип отдела (1 - Отдел, 2 - Группа)
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
 *           description: Рабочее время отдела
 *         parent:
 *           type: string
 *           description: ID родительского отдела (ссылка на модель Department) или null
 *         chief:
 *           type: string
 *           description: ID руководителя (ссылка на модель User) или null
 *       required:
 *         - _id
 *         - name
 *         - type
 */

/**
 * @swagger
 * /department:
 *   get:
 *     summary: Получение списка отделов
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Фильтр по названию отдела (регистронезависимый)
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Фильтр по типу отдела (1 - Отдел, 2 - Группа)
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: Фильтр по ID родительского отдела
 *       - in: query
 *         name: chief
 *         schema:
 *           type: string
 *         description: Фильтр по ID руководителя
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["active", "inactive", "deleted"]
 *         description: Фильтр по статусу отдела
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
 *         description: Успешный ответ со списком отделов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество отделов
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *       400:
 *         description: Ошибка валидации параметров запроса
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /department:
 *   post:
 *     summary: Создание нового отдела
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepartmentCreateRequest'
 *     responses:
 *       201:
 *         description: Отдел успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /department:
 *   put:
 *     summary: Обновление данных отдела
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepartmentUpdateRequest'
 *     responses:
 *       200:
 *         description: Данные отдела успешно обновлены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /department/status/{id}:
 *   get:
 *     summary: Изменение статуса отдела (active/inactive)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID отдела
 *     responses:
 *       200:
 *         description: Статус отдела успешно изменён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Отдел не найден или статус не может быть изменён
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
 *                   example: "departmentNotFound"
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /department/{id}:
 *   get:
 *     summary: Получение данных отдела по ID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID отдела
 *     responses:
 *       200:
 *         description: Успешный ответ с данными отдела
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Отдел не найден
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
 *                   example: "departmentNotFound"
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /department/{id}:
 *   delete:
 *     summary: Удаление отдела (пометка как deleted)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID отдела
 *     responses:
 *       200:
 *         description: Отдел успешно помечен как удалённый
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "deleted"
 *       400:
 *         description: Отдел не найден
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
 *                   example: "departmentNotFound"
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