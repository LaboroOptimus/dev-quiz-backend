const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class UserController {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные регистрации',
                    status: 'error',
                });
            }

            const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: 'Пользователь уже существует', status: 'error' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
            res.status(201).json({ message: 'Пользователь успешно зарегистрирован', status: "success" });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные авторизации',
                    status: 'error',
                });
            }

            const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);

            if (existingUser.rows.length === 0) {
                return res.status(401).json({ message: 'Пользователь не существует', status: 'error' });
            }

            const [user] = existingUser.rows;

            const isValidPassword = await bcrypt.compare(password, existingUser.rows[0].password);

            if (!isValidPassword) {
                return res.status(401).json({ message: 'Некорректные данные авторизации', status: 'error' });
            }

            const userId = existingUser.rows[0].id;
            const token = jwt.sign({ userId }, 'your_secret_key');
            const userSession = await db.query('SELECT * from userssessions WHERE userId = $1', [user.id]);

            if (!userSession.rows[0]) {
                await db.query('INSERT INTO userssessions (userId, jwt) VALUES ($1, $2)', [user.id, token])
            }
            else {
                await db.query('UPDATE userssessions SET jwt = $1 WHERE userId = $2', [token, user.id])
            }

            res.status(200).json({ message: 'Успешно', token: token, status: 'success' });
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCurrentUser(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;
            const session = await db.query('SELECT * from userssessions WHERE userId = $1', [userId]);

            if (!session.rows[0]) {
                return res.status(401).json({ message: 'Unauthorized access', status: 'error' })
            }

            const loggedUser = await db.query('SELECT * from users WHERE id = $1', [userId])
            const [user] = loggedUser.rows;
            res.status(200).json({ status: 'success', data: user })
        }
        catch (e) {
            console.error(e);
            res.status(401).json({ message: 'Unauthorized access' });
        }

    }

    async updateUserInfo(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');

            const { email, password, avatar, name } = req.body;

            // if (name) {
            //     await db.query
            // }
        }
        catch (e) {
            console.log(e);
            res.status(401).json({ message: 'Unauthorized access' });
        }
    }
}

module.exports = new UserController();