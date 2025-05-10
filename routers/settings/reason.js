import { Router } from "express";
import passport from "../../middleware/auth.js";
import { validateObjectId } from "../../middleware/validate.js";
import { top } from "../../middleware/role.js";
import { all, getOne, create, update, remove } from "../../controllers/settings/reason.js";

const router = Router();

router.route('/')
.all(passport.authenticate('jwt', { session: false }), top)
.get(all)
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
 *     Reason:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор причины
 *         title:
 *           type: string
 *           description: Название причины
 *         shortName:
 *           type: string
 *           description: Краткое название причины
 *         status:
 *           type: string
 *           enum: [active, inactive, deleted]
 *           description: Статус причины
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Время создания записи
 *       required:
 *         - _id
 *         - title
 *         - shortName
 *         - status
 *         - createdAt
 * 
 *     ReasonCreateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Название причины
 *         shortName:
 *           type: string
 *           description: Краткое название причины
 *       required:
 *         - title
 * 
 *     ReasonUpdateRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор причины
 *         title:
 *           type: string
 *           description: Название причины
 *         shortName:
 *           type: string
 *           description: Краткое название причины
 *       required:
 *         - _id
 *         - title
 */

/**
 * @swagger
 * /reason:
 *   get:
 *     summary: Получить список причин
 *     description: Возвращает список причин с возможностью фильтрации и пагинации
 *     tags:
 *       - Reasons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 150
 *         description: Фильтр по названию причины (частичное совпадение)
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
 *         description: Список причин
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество причин
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reason'
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   post:
 *     summary: Создать новую причину
 *     description: Создает новую причину с указанными параметрами
 *     tags:
 *       - Reasons
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReasonCreateRequest'
 *     responses:
 *       201:
 *         description: Причина создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reason'
 *       400:
 *         description: Неверные данные запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   put:
 *     summary: Обновить причину
 *     description: Обновляет причину с указанными параметрами
 *     tags:
 *       - Reasons
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReasonUpdateRequest'
 *     responses:
 *       200:
 *         description: Причина обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reason'
 *       400:
 *         description: Неверные данные запроса или причина не найдена
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 * /reason/{id}:
 *   get:
 *     summary: Получить одну причину
 *     description: Возвращает причину по ее ID
 *     tags:
 *       - Reasons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID причины
 *     responses:
 *       200:
 *         description: Причина найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reason'
 *       400:
 *         description: Неверный ID или причина не найдена
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 * 
 *   delete:
 *     summary: Удалить причину
 *     description: Помечает причину как удаленную (status = deleted)
 *     tags:
 *       - Reasons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID причины
 *     responses:
 *       200:
 *         description: Причина помечена как удаленная
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reason'
 *       400:
 *         description: Неверный ID или причина не найдена
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */