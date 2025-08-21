import { Router } from "express";
import passport from "../../middleware/auth.js";
import { validateObjectId } from "../../middleware/validate.js";
import { top, all as allMid } from "../../middleware/role.js";
import { all, create, tryAgain, remove } from "../../controllers/settings/user-synced-door.js";

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), allMid, all);

router.route('/')
  .all(passport.authenticate('jwt', { session: false }), top)
  .post(create);

router.route('/:id')
  .all(passport.authenticate('jwt', { session: false }), validateObjectId('params', 'id'), top)
  .get(tryAgain)
  .delete(remove);


export default router;


/**
 * @swagger
 * components:
 *   schemas:
 *     UserSyncedDoor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Уникальный идентификатор связи пользователя и двери
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *           description: Пользователь, которому синхронизирована дверь
 *         door:
 *           type: string
 *           description: ID двери
 *         status:
 *           type: string
 *           enum: [pending, success, error]
 *           description: Статус синхронизации
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Дата создания связи
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Дата обновления связи
 *
 * /user-synced-door:
 *   get:
 *     summary: Получить список синхронизированных дверей пользователя
 *     tags: [User Synced Doors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: door
 *         schema:
 *           type: string
 *         description: ID двери для фильтрации
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: ID пользователя для фильтрации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Количество записей на страницу
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *     responses:
 *       200:
 *         description: Успешный ответ со списком связей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество записей
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserSyncedDoor'
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 *
 *   post:
 *     summary: Создать новую связь пользователя и двери
 *     tags: [User Synced Doors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID пользователя
 *               door:
 *                 type: string
 *                 description: ID двери
 *             required:
 *               - user
 *               - door
 *     responses:
 *       201:
 *         description: Связь успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSyncedDoor'
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 *
 * /user-synced-door/{id}:
 *   get:
 *     summary: Повторить попытку синхронизации пользователя с дверью
 *     tags: [User Synced Doors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID связи
 *     responses:
 *       200:
 *         description: Повторная попытка синхронизации выполнена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSyncedDoor'
 *       400:
 *         description: Связь не найдена
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 *
 *   delete:
 *     summary: Удалить связь пользователя и двери
 *     tags: [User Synced Doors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID связи
 *     responses:
 *       200:
 *         description: Связь успешно удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: deleted
 *       400:
 *         description: Связь не найдена
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */