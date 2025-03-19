import { Router } from "express";
import passport from "../../middleware/auth.js"
import { all } from "../../middleware/role.js";
import { getDoors, getLastDoorEvent, postDoorEvents, syncDoors } from "../../controllers/api/door.js";
const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), all, getDoors);
router.get('/last-event', passport.authenticate("jwt", { session: false }), all, getLastDoorEvent);
router.post("/post-events", passport.authenticate("jwt",  { session: false }), all, postDoorEvents);
router.post('/post-sync', passport.authenticate("jwt", { session: false }), all, syncDoors);


export default router;


/**
 * @swagger
 * /api/door:
 *   get:
 *     summary: Получить список дверей
 *     description: Возвращает список дверей
 *     tags:
 *       - API Doors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список дверей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Уникальный идентификатор двери
 *                 ip:
 *                   type: string
 *                   description: IP-адрес двери
 *                 login:
 *                   type: string
 *                   description: Логин для доступа к двери
 *                 password:
 *                   type: string
 *                   description: Пароль для доступа к двери
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

/**
 * @swagger
 * /api/door/last-event:
 *   get:
 *     summary: Получить список дверей и последнее событие
 *     description: Возвращает список дверей и последнее событие
 *     tags:
 *       - API Doors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список дверей и последних событий
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Уникальный идентификатор двери
 *                 ip:
 *                   type: string
 *                   description: IP-адрес двери
 *                 login:
 *                   type: string
 *                   description: Логин для доступа к двери
 *                 password:
 *                   type: string
 *                   description: Пароль для доступа к двери
 *                 lastEvent:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       description: Время события
 *                     employeeNoString:
 *                       type: string
 *                       description: Номер сотрудника
 *                     serialNo:
 *                       type: number
 *                       description: Серийный номер
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

/**
 * @swagger
 * /api/door/post-events:
 *   post:
 *     summary: Отправить события дверей
 *     description: Отправляет события дверей
 *     tags:
 *       - API Doors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doorId:
 *                 type: string
 *                 description: Уникальный идентификатор двери
 *               events:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [face, card]
 *                     time:
 *                       type: string
 *                       format: date-time
 *                     branch:
 *                       type: string
 *                     employeeNoString:
 *                       type: string
 *                     serialNo:
 *                       type: number
 *                     pictureURL:
 *                       type: string
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "События успешно обработаны"
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

/**
  * @swagger
  * /api/door/post-sync:
  *  post:
  *    summary: Успешные синхронизации
  *    description: Успешные синхронизации
  *    tags:
  *      - API Doors
  *    security:
  *      - bearerAuth: []
  *    requestBody:
  *      required: true
  *      content:
  *        application/json:
  *          schema:
  *            type: object
  *            properties:
  *              userId:
  *                type: string
  *                description: Уникальный идентификатор пользователя
  *              door:
  *                type: string
  *                description: Уникальный идентификатор двери
  *    responses:
  *      200:
  *        description: Успешный ответ
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                message:
  *                  type: string
  *                  example: "Дверь успешно синхронизирована"
  *      400:
  *        description: Неверные параметры запроса
  *      401:
  *        description: Не авторизован
 */

/**
 * @swagger
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */