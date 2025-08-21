import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top, all as allMid } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import {
  all,
  create,
  getOne,
  update,
  remove,
} from "../../controllers/settings/absence.js";

router.get("/", passport.authenticate("jwt", { session: false }), allMid, all);

router.route('/')
.all(passport.authenticate('jwt', { session: false }), top)
.post(create)
.put(update);

router.route('/:id')
.all(passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top)
.get(getOne)
.delete(remove);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Absence:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор отсутствия
 *         user:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *               description: Полное имя пользователя
 *           description: Пользователь, связанный с отсутствием
 *         reason:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Название причины отсутствия
 *             shornName:
 *               type: string
 *               description: Краткое название причины
 *           description: Причина отсутствия
 *         title:
 *           type: string
 *           description: Название отсутствия
 *         description:
 *           type: string
 *           description: Описание отсутствия
 *         doc:
 *           type: string
 *           description: Ссылка на связанный документ (если есть)
 *         start:
 *           type: string
 *           format: date-time
 *           description: Дата и время начала отсутствия
 *         end:
 *           type: string
 *           format: date-time
 *           description: Дата и время окончания отсутствия
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания записи
 *       required:
 *         - _id
 *         - user
 *         - reason
 *         - title
 *         - start
 *         - end
 * 
 *     AbsenceCreate:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: Идентификатор пользователя (ObjectId)
 *         reason:
 *           type: string
 *           description: Идентификатор причины отсутствия (ObjectId)
 *         title:
 *           type: string
 *           description: Название отсутствия
 *         description:
 *           type: string
 *           description: Описание отсутствия
 *         doc:
 *           type: string
 *           description: Ссылка на связанный документ (если есть)
 *         start:
 *           type: string
 *           format: date-time
 *           description: Дата и время начала отсутствия
 *         end:
 *           type: string
 *           format: date-time
 *           description: Дата и время окончания отсутствия
 *       required:
 *         - user
 *         - reason
 *         - title
 *         - start
 *         - end
 * 
 *     AbsenceUpdate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор отсутствия
 *         user:
 *           type: string
 *           description: Идентификатор пользователя (ObjectId)
 *         reason:
 *           type: string
 *           description: Идентификатор причины отсутствия (ObjectId)
 *         title:
 *           type: string
 *           description: Название отсутствия
 *         description:
 *           type: string
 *           description: Описание отсутствия
 *         doc:
 *           type: string
 *           description: Ссылка на связанный документ (если есть)
 *         start:
 *           type: string
 *           format: date-time
 *           description: Дата и время начала отсутствия
 *         end:
 *           type: string
 *           format: date-time
 *           description: Дата и время окончания отсутствия
 *       required:
 *         - _id
 *         - user
 *         - reason
 *         - title
 *         - start
 *         - end
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /absence:
 *   get:
 *     summary: Получить список отсутствий
 *     description: Возвращает список отсутствий с фильтрацией по пользователю, причине, году и месяцу, с поддержкой пагинации. Поля user и reason популируются.
 *     tags:
 *       - Absences
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Идентификатор пользователя (ObjectId)
 *         required: true
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2024
 *           maximum: 2100
 *         description: Год для фильтрации (по умолчанию текущий год)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 11
 *         description: Месяц для фильтрации (0-11, по умолчанию текущий месяц)
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *         description: Идентификатор причины отсутствия (ObjectId)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы (по умолчанию 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           enum: [0, 1, 30, 50, 100]
 *         description: Количество записей на странице (по умолчанию 30)
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество отсутствий
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Absence'
 *                   description: Список отсутствий
 *               example:
 *                 count: 10
 *                 data:
 *                   - _id: "absence_id_1"
 *                     user:
 *                       fullName: "Иван Иванов"
 *                     reason:
 *                       title: "Отпуск"
 *                       shornName: "VAC"
 *                     title: "Ежегодный отпуск"
 *                     description: "Отпуск на море"
 *                     start: "2025-06-01T00:00:00Z"
 *                     end: "2025-06-15T23:59:59Z"
 *                     createdAt: "2025-05-20T10:00:00Z"
 *                   - _id: "absence_id_2"
 *                     user:
 *                       fullName: "Мария Петрова"
 *                     reason:
 *                       title: "Больничный"
 *                       shornName: "SICK"
 *                     title: "Больничный лист"
 *                     description: "Грипп"
 *                     doc: "/files/absences/sick_leave.pdf"
 *                     start: "2025-06-10T00:00:00Z"
 *                     end: "2025-06-17T23:59:59Z"
 *                     createdAt: "2025-05-20T10:01:00Z"
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   post:
 *     summary: Создать новое отсутствие
 *     description: Создает новую запись об отсутствии. Поля user и reason популируются.
 *     tags:
 *       - Absences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AbsenceCreate'
 *           example:
 *             user: "user_id_1"
 *             reason: "reason_id_1"
 *             title: "Ежегодный отпуск"
 *             description: "Отпуск на море"
 *             start: "2025-06-01T00:00:00Z"
 *             end: "2025-06-15T23:59:59Z"
 *     responses:
 *       201:
 *         description: Отсутствие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Absence'
 *             example:
 *               _id: "absence_id_3"
 *               user:
 *                 fullName: "Иван Иванов"
 *               reason:
 *                 title: "Отпуск"
 *                 shornName: "VAC"
 *               title: "Ежегодный отпуск"
 *               description: "Отпуск на море"
 *               start: "2025-06-01T00:00:00Z"
 *               end: "2025-06-15T23:59:59Z"
 *               createdAt: "2025-05-20T10:02:00Z"
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   put:
 *     summary: Обновить отсутствие
 *     description: Обновляет запись об отсутствии по её ID. Поля user и reason популируются.
 *     tags:
 *       - Absences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AbsenceUpdate'
 *           example:
 *             _id: "absence_id_1"
 *             user: "user_id_1"
 *             reason: "reason_id_2"
 *             title: "Обновленный отпуск"
 *             description: "Продленный отпуск"
 *             start: "2025-06-01T00:00:00Z"
 *             end: "2025-06-20T23:59:59Z"
 *     responses:
 *       200:
 *         description: Отсутствие успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Absence'
 *             example:
 *               _id: "absence_id_1"
 *               user:
 *                 fullName: "Иван Иванов"
 *               reason:
 *                 title: "Больничный"
 *                 shornName: "SICK"
 *               title: "Обновленный отпуск"
 *               description: "Продленный отпуск"
 *               start: "2025-06-01T00:00:00Z"
 *               end: "2025-06-20T23:59:59Z"
 *               createdAt: "2025-05-20T10:00:00Z"
 *       400:
 *         description: Неверные параметры запроса или отсутствие не найдено
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

/**
 * @swagger
 * /absence/{id}:
 *   get:
 *     summary: Получить информацию об отсутствии
 *     description: Возвращает информацию об отсутствии по его ID. Исключаются поля __v, createdAt и updatedAt.
 *     tags:
 *       - Absences
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор отсутствия
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Absence'
 *             example:
 *               _id: "absence_id_1"
 *               user:
 *                 fullName: "Иван Иванов"
 *               reason:
 *                 title: "Отпуск"
 *                 shornName: "VAC"
 *               title: "Ежегодный отпуск"
 *               description: "Отпуск на море"
 *               start: "2025-06-01T00:00:00Z"
 *               end: "2025-06-15T23:59:59Z"
 *       400:
 *         description: Отсутствие не найдено
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   delete:
 *     summary: Удалить отсутствие
 *     description: Удаляет запись об отсутствии по её ID.
 *     tags:
 *       - Absences
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор отсутствия
 *     responses:
 *       200:
 *         description: Отсутствие успешно удалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об успешном удалении
 *               example:
 *                 message: "deleted"
 *       400:
 *         description: Отсутствие не найдено
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */