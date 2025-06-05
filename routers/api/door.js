import { Router } from "express";
import passport from "../../middleware/auth.js"
import { getDoors, getOpenDoors, getLastDoorEvent, postDoorEvents, getNotSyncedUsers, openDoorsNotSyncedUsers, syncDoors, existsDoorEvent, getUserByEmployee } from "../../controllers/api/door.js";
const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), getDoors);
router.get("/open-doors", getOpenDoors)
router.get("/last-event", getLastDoorEvent);
router.post("/post-events", postDoorEvents);
router.get("/user-not-synced", passport.authenticate("jwt", { session: false }), getNotSyncedUsers);
router.post("/open-doors/user-not-synced", openDoorsNotSyncedUsers);
router.post("/post-sync", syncDoors);
router.post("/exists-event", existsDoorEvent);
router.post("/exists-user", getUserByEmployee);


export default router;


/**
 * @swagger
 * /api/door:
 *   get:
 *     summary: Получить список дверей
 *     description: Возвращает список дверей
 *     tags:
 *       - API Doors
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
 * /api/door/open-doors:
 *   get:
 *     summary: Получить список открытых дверей
 *     description: Возвращает список открытых дверей
 *     tags:
 *       - API Doors
 *     responses:
 *       200:
 *         description: Список открытых дверей
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
 * /api/door/open-doors/user-not-synced:
 *   post:
 *     summary: Получить пользователей, не синхронизированных с дверьми
 *     description: Возвращает список дверей и пользователей, которые не синхронизированы с указанными дверьми (IP пользователей не совпадает с IP двери).
 *     tags:
 *       - API Doors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *               description: Уникальный идентификатор двери
 *             example: ["door_id_1", "door_id_2"]
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doorId:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Уникальный идентификатор пользователя
 *                       fullName:
 *                         type: string
 *                         description: Полное имя сотрудника
 *                       faceUrl:
 *                         type: string
 *                         description: Ссылка на фото лица
 *                       employeeNo:
 *                         type: string
 *                         description: Уникальный идентификатор для девайса
 *                       gender:
 *                         type: string
 *                         description: Пол пользователя
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */

/**
 * @swagger
 * /api/door/user-not-synced:
 *   get:
 *     summary: Получить массив сотрудников, не синхронизированных с девайсом
 *     description: Получить массив сотрудников, не синхронизированных с девайсом Hikvision по IP
 *     tags:
 *       - API Doors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doorId:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Уникальный идентификатор пользователя
 *                       fullName:
 *                         type: string
 *                         description: Полное имя сотрудника
 *                       faceUrl:
 *                         type: string
 *                         description: Ссылка на фото лица
 *                       employeeNo:
 *                         type: string
 *                         description: Уникальный идентификатор для девайса
 *                       gender:
 *                         type: string
 *                         description: Пол пользователя
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 */

/**
  * @swagger
  * /api/door/post-sync:
  *  post:
  *    summary: Успешные синхронизации
  *    description: Успешные синхронизации
  *    tags:
  *      - API Doors
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
 * /api/door/exists-event:
 *   post:
 *     summary: Проверка наличия события
 *     description: Проверка наличия события
 *     tags:
 *       - API Doors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               door:
 *                 type: string
 *                 description: Уникальный идентификатор двери
 *               employeeNoString:
 *                 type: number
 *                 description: Номер сотрудника
 *               serialNo:
 *                 type: number
 *                 description: Серийный номер
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: Время события
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Наличие события
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован 
 */

/**
 * @swagger
 * /api/door/exists-user:
 *   post:
 *     summary: Проверить существование пользователя по номеру сотрудника
 *     description: Проверяет, существует ли пользователь с указанным номером сотрудника. Возвращает объект с полем exists, указывающим на наличие пользователя.
 *     tags:
 *       - API Doors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeNo:
 *               type: string
 *               description: Номер сотрудника для проверки
 *           example:
 *             employeeNo: "EMP12345"
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: Существует ли пользователь с указанным номером сотрудника
 *             example:
 *               exists: true
 *       400:
 *         description: Неверные параметры запроса
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       500:
 *         description: Внутренняя ошибка сервера
 */

/**
 * @swagger
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */