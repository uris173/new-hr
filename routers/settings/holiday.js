import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import {
  all,
  create,
  getOne,
  update,
  remove
} from "../../controllers/settings/holiday.js";

router.route("/")
.all(passport.authenticate("jwt", { session: false }), top)
.get(all)
.post(create)
.put(update);

router.route("/:id")
.all(passport.authenticate("jwt", { session: false }), validateObjectId("params", "id"), top)
.get(getOne)
.delete(remove);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Holiday:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор праздника
 *         title:
 *           type: string
 *           description: Название праздника
 *         date:
 *           type: string
 *           format: date-time
 *           description: Дата праздника
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Время создания записи
 *       required:
 *         - _id
 *         - title
 *         - date
 *         - createdAt
 * 
 *     HolidayCreateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Название праздника
 *         date:
 *           type: string
 *           format: date-time
 *           description: Дата праздника
 *       required:
 *         - title
 *         - date
 * 
 *     HolidayUpdateRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор праздника
 *         title:
 *           type: string
 *           description: Название праздника
 *         date:
 *           type: string
 *           format: date-time
 *           description: Дата праздника
 *       required:
 *         - _id
 *         - title
 *         - date
 */

/**
 * @swagger
 * /holiday:
 *   get:
 *     summary: Получить список праздников
 *     description: Возвращает список праздников с возможностью фильтрации и пагинации
 *     tags:
 *       - Holidays
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Фильтр по названию праздника (частичное совпадение)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Фильтр по году (по умолчанию текущий год)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           enum: [30, 50, 100]
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Список праздников
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество праздников
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Holiday'
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   post:
 *     summary: Создать новый праздник
 *     description: Создает новый праздник с указанными параметрами
 *     tags:
 *       - Holidays
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HolidayCreateRequest'
 *     responses:
 *       201:
 *         description: Праздник создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Holiday'
 *       400:
 *         description: Неверные данные запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   put:
 *     summary: Обновить праздник
 *     description: Обновляет праздник с указанными параметрами
 *     tags:
 *       - Holidays
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HolidayUpdateRequest'
 *     responses:
 *       200:
 *         description: Праздник обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Holiday'
 *       400:
 *         description: Неверные данные запроса или праздник не найден
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 * /holiday/{id}:
 *   get:
 *     summary: Получить один праздник
 *     description: Возвращает праздник по его ID
 *     tags:
 *       - Holidays
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID праздника
 *     responses:
 *       200:
 *         description: Праздник найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Holiday'
 *       400:
 *         description: Неверный ID или праздник не найден
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   delete:
 *     summary: Удалить праздник
 *     description: Удаляет праздник по его ID
 *     tags:
 *       - Holidays
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID праздника
 *     responses:
 *       200:
 *         description: Праздник удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Holiday'
 *       400:
 *         description: Неверный ID или праздник не найден
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

