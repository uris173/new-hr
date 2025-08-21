import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top, all } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import {
  getStaffPosition,
  allWorkerHistory,
  createHistory,
  getOne,
  update,
  remove
} from "../../controllers/data/worker.js";

router.post('/staff-positions', passport.authenticate('jwt', { session: false }), top, getStaffPosition);

router.get("/history", passport.authenticate("jwt", { session: false }), all, allWorkerHistory);

router.route("/history")
.all(passport.authenticate('jwt', { session: false }), top)
.post(createHistory)
.put(update);

router.route("/history/:id")
.all(passport.authenticate('jwt', { session: false }), validateObjectId("params", "id"), top)
.get(getOne)
.delete(remove);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkerHistory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор записи истории работы
 *         user:
 *           type: string
 *           description: ID пользователя, к которому относится запись (ссылка на модель User)
 *         company:
 *           type: string
 *           description: Название компании, в которой работал сотрудник
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
 *           description: Комментарий к записи
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания записи
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkerHistoryCreateRequest:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: ID пользователя
 *         company:
 *           type: string
 *           description: Название компании, в которой работал сотрудник
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
 *           description: Комментарий к записи (необязательно)
 *       required:
 *         - user
 *         - company
 *         - staffPosition
 *         - enterDate
 *         - leaveDate
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkerHistoryUpdateRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID записи истории работы
 *         user:
 *           type: string
 *           description: ID пользователя
 *         company:
 *           type: string
 *           description: Название компании, в которой работал сотрудник
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
 *           description: Комментарий к записи (необязательно)
 *       required:
 *         - _id
 *         - user
 *         - company
 *         - staffPosition
 *         - enterDate
 *         - leaveDate
 */

/**
 * @swagger
 * /worker/staff-positions:
 *   post:
 *     summary: Поиск должностей по названию
 *     tags: [Worker history]
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
 *                 description: Строка для поиска должностей
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
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Название должности
 *       400:
 *         description: Ошибка поиска или отсутствие параметра title
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker/history:
 *   get:
 *     summary: Получение истории работы сотрудника
 *     tags: [Worker history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: ID пользователя для фильтрации записей
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
 *         description: Успешный ответ со списком записей истории работы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество записей
 *                 workerHistory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorkerHistory'
 *       400:
 *         description: Ошибка валидации параметров запроса
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker/history:
 *   post:
 *     summary: Создание новой записи истории работы
 *     tags: [Worker history]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkerHistoryCreateRequest'
 *     responses:
 *       201:
 *         description: Запись успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerHistory'
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker/history:
 *   put:
 *     summary: Обновление существующей записи истории работы
 *     tags: [Worker history]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkerHistoryUpdateRequest'
 *     responses:
 *       200:
 *         description: Запись успешно обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerHistory'
 *       400:
 *         description: Ошибка валидации данных или запись не найдена
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker/history/{id}:
 *   get:
 *     summary: Получение записи истории работы по ID
 *     tags: [Worker history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID записи истории работы
 *     responses:
 *       200:
 *         description: Успешный ответ с данными записи
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerHistory'
 *       400:
 *         description: Запись не найдена
 *       401:
 *         description: Неавторизованный доступ
 */

/**
 * @swagger
 * /worker/history/{id}:
 *   delete:
 *     summary: Удаление записи истории работы
 *     tags: [Worker history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID записи истории работы
 *     responses:
 *       200:
 *         description: Запись успешно удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "workerHistoryDeleted"
 *       400:
 *         description: Запись не найдена
 *       401:
 *         description: Неавторизованный доступ
 */


