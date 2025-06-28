import { Router } from "express";
import passport from "../../middleware/auth.js";
import { top, manage } from "../../middleware/role.js";
import { validateObjectId } from "../../middleware/validate.js";
const router = Router();

import {
  all,
  create,
  getOne,
  changeStatus,
  update,
  remove,
} from "../../controllers/settings/branch.js";

router.get("/", passport.authenticate("jwt", { session: false }), manage, all);

router.route('/')
.all(passport.authenticate('jwt', { session: false }), top)
.post(create)
.put(update);

router.get('/status/:id', passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), changeStatus);

router.route('/:id')
.all(passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top)
.get(getOne)
.delete(remove);


export default router;


//  *         location:
//  *           type: object
//  *           properties:
//  *             address:
//  *               type: string
//  *               description: Адрес филиала
//  *             coordinates:
//  *               type: array
//  *               items:
//  *                 type: number
//  *               description: Координаты филиала (долгота и широта)
//  *               example: [37.6173, 55.7558]

/**
 * @swagger
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор филиала
 *         title:
 *           type: string
 *           description: Название филиала
 *         description:
 *           type: string
 *           description: Описание филиала
 *         status:
 *           type: string
 *           enum: [active, inactive, deleted]
 *           description: Статус филиала
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания филиала
 *       required:
 *         - _id
 *         - title
 *         - description
 *         - status
 *         - createdAt
 * 
 *     BranchCreate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Название филиала
 *         description:
 *           type: string
 *           description: Описание филиала
 *       required:
 *         - title
 *         - description
 * 
 *     BranchUpdate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор филиала
 *         title:
 *           type: string
 *           description: Название филиала
 *         description:
 *           type: string
 *           description: Описание филиала
 *       required:
 *         - _id
 *         - title
 *         - description
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /branch:
 *   get:
 *     summary: Получить список филиалов
 *     description: Возвращает список филиалов с возможностью фильтрации по названию и пагинацией. Исключаются филиалы со статусом "deleted".
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Фильтр по названию филиала (регистронезависимый поиск)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы (по умолчанию 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество филиалов на странице (по умолчанию 30)
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
 *                   description: Общее количество филиалов
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Branch'
 *                   description: Список филиалов
 *               example:
 *                 count: 50
 *                 data:
 *                   - _id: "branch_id_1"
 *                     title: "Центральный офис"
 *                     description: "Главный филиал компании"
 *                     status: "active"
 *                     createdAt: "2025-04-25T10:00:00Z"
 *                   - _id: "branch_id_2"
 *                     title: "Региональный офис"
 *                     description: "Филиал в Санкт-Петербурге"
 *                     status: "inactive"
 *                     createdAt: "2025-04-25T10:01:00Z"
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   post:
 *     summary: Создать новый филиал
 *     description: Создает новый филиал с указанными параметрами.
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchCreate'
 *           example:
 *             title: "Новый филиал"
 *             description: "Филиал в Новосибирске"
 *     responses:
 *       201:
 *         description: Филиал успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *             example:
 *               _id: "branch_id_3"
 *               title: "Новый филиал"
 *               description: "Филиал в Новосибирске"
 *               status: "active"
 *               createdAt: "2025-04-25T10:02:00Z"
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   put:
 *     summary: Обновить информацию о филиале
 *     description: Обновляет информацию о филиале по его ID.
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BranchUpdate'
 *           example:
 *             _id: "branch_id_1"
 *             title: "Обновленный офис"
 *             description: "Обновленный главный филиал"
 *     responses:
 *       200:
 *         description: Филиал успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *             example:
 *               _id: "branch_id_1"
 *               title: "Обновленный офис"
 *               description: "Обновленный главный филиал"
 *               status: "active"
 *               createdAt: "2025-04-25T10:00:00Z"
 *       400:
 *         description: Неверные параметры запроса или филиал не найден
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

/**
 * @swagger
 * /branch/status/{id}:
 *   get:
 *     summary: Изменить статус филиала
 *     description: Переключает статус филиала между "active" и "inactive".
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор филиала
 *     responses:
 *       200:
 *         description: Статус филиала успешно изменен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *             example:
 *               _id: "branch_id_1"
 *               title: "Центральный офис"
 *               description: "Главный филиал компании"
 *               status: "inactive"
 *               createdAt: "2025-04-25T10:00:00Z"
 *       400:
 *         description: Филиал не найден
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

/**
 * @swagger
 * /branch/{id}:
 *   get:
 *     summary: Получить информацию о филиале
 *     description: Возвращает информацию о филиале по его ID. Исключаются поля createdAt и status.
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор филиала
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *             example:
 *               _id: "branch_id_1"
 *               title: "Центральный офис"
 *               description: "Главный филиал компании"
 *       400:
 *         description: Филиал не найден
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   delete:
 *     summary: Удалить филиал
 *     description: Устанавливает статус филиала в "deleted".
 *     tags:
 *       - Branches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор филиала
 *     responses:
 *       200:
 *         description: Филиал успешно удален
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
 *         description: Филиал не найден
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */