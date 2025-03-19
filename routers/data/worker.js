import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import {
  getStaffPosition,
  all,
  create,
  getInfo,
  getOne,
  update,
  remove,
} from "../../controllers/data/worker.js";

router.post('/staff-positions', passport.authenticate('jwt', { session: false }), top, getStaffPosition);

router.route('/')
.all(passport.authenticate('jwt', { session: false }), top)
.get(all)
.post(create)
.put(update);

router.get('/worker-info/:id', passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top, getInfo);

router.route('/:id')
.all(passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top)
.get(getOne)
.delete(remove);


export default router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Worker:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор сотрудника
 *         user:
 *           type: string
 *           description: ID пользователя (ссылка на модель User)
 *         department:
 *           type: string
 *           description: ID отдела (ссылка на модель Department)
 *         groups:
 *           type: array
 *           items:
 *             type: string
 *           description: Список ID групп (ссылки на модель Group)
 *         birthDay:
 *           type: string
 *           format: date
 *           description: Дата рождения сотрудника
 *         address:
 *           type: string
 *           description: Адрес сотрудника
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "deleted"]
 *           description: Статус сотрудника
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания записи
 *       required:
 *         - department
 *         - birthDay
 *         - address
 * 
 *     WorkerHistory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор записи истории
 *         company:
 *           type: string
 *           description: Название компании
 *         staffPosition:
 *           type: string
 *           description: Должность сотрудника
 *         enterDate:
 *           type: string
 *           format: date
 *           description: Дата начала работы
 *         leaveDate:
 *           type: string
 *           format: date
 *           description: Дата окончания работы
 *         comment:
 *           type: string
 *           description: Комментарий
 *       required:
 *         - company
 *         - staffPosition
 *         - enterDate
 *         - leaveDate
 * 
 *     WorkerCreateRequest:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: ID пользователя (ссылка на модель User)
 *         department:
 *           type: string
 *           description: ID отдела (ссылка на модель Department)
 *         groups:
 *           type: array
 *           items:
 *             type: string
 *           description: Список ID групп (ссылки на модель Group)
 *         gender:
 *           type: string
 *           enum: ["male", "female", "custom"]
 *           description: Пол сотрудника
 *         birthDay:
 *           type: string
 *           format: date
 *           description: Дата рождения сотрудника
 *         address:
 *           type: string
 *           description: Адрес сотрудника
 *         history:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 description: Название компании
 *               staffPosition:
 *                 type: string
 *                 description: Должность сотрудника
 *               enterDate:
 *                 type: string
 *                 format: date
 *                 description: Дата начала работы
 *               leaveDate:
 *                 type: string
 *                 format: date
 *                 description: Дата окончания работы
 *               comment:
 *                 type: string
 *                 description: Комментарий
 *           description: История работы сотрудника
 *       required:
 *         - department
 *         - gender
 *         - birthDay
 *         - address
 * 
 *     WorkerUpdateRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор сотрудника
 *         user:
 *           type: string
 *           description: ID пользователя (ссылка на модель User)
 *         department:
 *           type: string
 *           description: ID отдела (ссылка на модель Department)
 *         groups:
 *           type: array
 *           items:
 *             type: string
 *           description: Список ID групп (ссылки на модель Group)
 *         gender:
 *           type: string
 *           enum: ["male", "female", "custom"]
 *           description: Пол сотрудника
 *         birthDay:
 *           type: string
 *           format: date
 *           description: Дата рождения сотрудника
 *         address:
 *           type: string
 *           description: Адрес сотрудника
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkerHistory'
 *           description: История работы сотрудника
 *       required:
 *         - _id
 *         - department
 *         - gender
 *         - birthDay
 *         - address
 */

/**
 * @swagger
 * /worker/staff-positions:
 *   post:
 *     summary: Поиск должностей по названию
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название должности для поиска (регистронезависимый)
 *             required:
 *               - title
 *     responses:
 *       200:
 *         description: Успешный ответ со списком найденных должностей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffPosition'
 *       400:
 *         description: Ошибка - название должности не указано
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
 *                   example: "titleNotFound"
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker:
 *   get:
 *     summary: Получение списка сотрудников
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Фильтр по полному имени сотрудника
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Фильтр по ID отдела
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
 *         description: Успешный ответ со списком сотрудников
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество сотрудников
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Worker'
 *       400:
 *         description: Ошибка валидации параметров запроса
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker:
 *   post:
 *     summary: Создание нового сотрудника
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkerCreateRequest'
 *     responses:
 *       201:
 *         description: Сотрудник успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker:
 *   put:
 *     summary: Обновление данных сотрудника
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkerUpdateRequest'
 *     responses:
 *       200:
 *         description: Данные сотрудника успешно обновлены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Сотрудник не найден
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker/worker-info/{id}:
 *   get:
 *     summary: Получение информации о сотруднике по ID пользователя
 *     tags: [Workers]
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
 *         description: Успешный ответ с данными сотрудника и историей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 worker:
 *                   $ref: '#/components/schemas/Worker'
 *                 history:
 *                   $ref: '#/components/schemas/WorkerHistory'
 *       404:
 *         description: Сотрудник не найден
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker/{id}:
 *   get:
 *     summary: Получение данных сотрудника по ID
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID сотрудника
 *     responses:
 *       200:
 *         description: Успешный ответ с данными сотрудника и историей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 worker:
 *                   $ref: '#/components/schemas/Worker'
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorkerHistory'
 *       404:
 *         description: Сотрудник не найден
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker/{id}:
 *   delete:
 *     summary: Удаление сотрудника (пометка как deleted)
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID сотрудника
 *     responses:
 *       200:
 *         description: Сотрудник успешно помечен как удалённый
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "deleted"
 *       400:
 *         description: Сотрудник не найден
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