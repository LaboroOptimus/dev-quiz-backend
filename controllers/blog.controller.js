const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class BlogController {
    async getAllArticles(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;

            const articlesRows = await db.query(`SELECT * from articles ORDER BY id DESC LIMIT 10`)
            const articlesIds = articlesRows.rows.map((item) => item.id);

            let data = []

            for (let i = 0; i < articlesIds.length; i++) {
                let topicIdsRows = await db.query(`SELECT topicId from articlestopics WHERE articleId=${articlesIds[i]}`)
                data = [...data, { ...articlesRows.rows[i], topics: topicIdsRows.rows.map((item) => item.topicid) }]
            }

            res.status(200).json({ status: 'success', data: data })
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Unauthorized access' });
        }
    }

    async createArticle(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;
            const { topicsId, text, title } = req.body;

            const date = new Date();
            const timestamp = date.toISOString();

            const articleRow = await db.query(
                'INSERT INTO articles (title, text, userId, creationDate) VALUES ($1, $2, $3, $4) RETURNING id ',
                [title, text, userId, timestamp]
            );
            const articleId = articleRow.rows[0].id;

            for (let i = 0; i < topicsId.length; i++) {
                await db.query(
                    'INSERT INTO articlestopics (topicId, articleId) VALUES ($1, $2) RETURNING id ',
                    [topicsId[i], articleId]
                );
            }

            await db.query(
                'INSERT INTO usersarticles (userId, articleId) VALUES ($1, $2) RETURNING id ',
                [userId, articleId]
            );

            res.status(200).json({ status: 'success' })
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Error' });
        }

    }

    async getArticleById(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;
            const { articleId } = req.body;

            const articleRow = await db.query(`SELECT * from articles WHERE id=${articleId}`);
            res.status(200).json({ status: 'success', data: articleRow.rows[0] })

        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Error' });
        }
    }

    async getArticleByTopics(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;
            const { topicIds } = req.body;

            const articlesTopicsRows = await db.query(`SELECT articleId FROM articlestopics WHERE topicId IN (${topicIds.join(',')}) GROUP BY articleId HAVING COUNT(DISTINCT topicId) >= 1`);
            const articlesIds = articlesTopicsRows.rows.map((item) => item.articleid);
            const articlesRows = await db.query(`SELECT * FROM articles WHERE id IN (${articlesIds.join(',')})`);

            res.status(200).json({ status: 'success', data: articlesRows.rows })

        } catch (e) {
            res.status(500).json({ message: 'Error' });
        }
    }

}

module.exports = new BlogController();