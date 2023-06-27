const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
// const { fileTypeFromBuffer } = import('file-type');

const decodeBase64Img = (base64String) => {
    const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
        obj = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    const [, extension, base64] = matches;

    obj.type = extension;
    obj.buffer = Buffer.from(base64, 'base64');

    return obj;
    // Based on: https://stackoverflow.com/Questions/20267939/Nodejs-Write-Base64-Image-File
};

class UserController {
    async register(req, res) {
        try {
            const { email, password, profileImageId, name } = req.body;
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

            const userImageRow = await db.query('SELECT image FROM useravatars WHERE id = $1', [profileImageId]);
            const userImage = userImageRow.rows[0].image;

            const hashedPassword = await bcrypt.hash(password, 12);
            await db.query('INSERT INTO users (email, password, profileimage, name) VALUES ($1, $2, $3, $4)', [email, hashedPassword, userImage, name]);
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

            const returnedUser = {
                ...user,
                profileimage: Buffer.from(user.profileimage).toString('base64')
            }
            res.status(200).json({ status: 'success', data: returnedUser })
        }
        catch (e) {
            console.error(e);
            res.status(401).json({ message: 'Unauthorized access' });
        }

    }

    async uploadImage(req, res) {
        try {
            if (req.body.file) {
                const buffer = decodeBase64Img(req.body.file).buffer;
                const result = await db.query('INSERT INTO useravatars (image) VALUES ($1) RETURNING id', [buffer])
                res.status(200).json({ status: 'success', data: { id: result.rows[0].id } })
            }
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Error', e });
        }

    }

    async updateUserAvatar(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;

            const buffer = decodeBase64Img(req.body.file).buffer;

            await db.query('UPDATE users SET profileImage = $1 WHERE id = $2', [buffer, userId ])
            res.status(200).json({ status: 'success' })
            
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Error', e });
        }
    }

    async updateUserInfo(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;
            const { password, name, email } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);

            await db.query('UPDATE users SET password = $1, name = $2, email = $3, WHERE id = $4', [hashedPassword, name, email, userId])

            res.status(200).json({ status: 'success' })
            
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Error', e });
        }
    }
}

module.exports = new UserController();