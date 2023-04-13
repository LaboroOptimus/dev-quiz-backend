const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class TestsController {
    async getTests(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            // check users session ?
            const userId = decodedToken.userId;

            const tests = await db.query('SELECT * from tests LIMIT 20')
            const testsIds = tests.rows.map((item) => item.id);

            let testData = [];

            for (let i = 0; i < testsIds.length; i++) {

                let currentTest = tests.rows.filter((elem) => elem.id === testsIds[i]) // текущий тест
                const questionRows = await db.query(`SELECT * from questions WHERE testid = ${testsIds[i]}`) // все вопросы теста
                const questionsIds = questionRows.rows.map((item) => item?.id); // все айдишники вопросов
                let questionsData = [];


                for (let j = 0; j < questionsIds.length; j++) {
                    const answersRows = await db.query('SELECT * from answers WHERE questionId = $1', [questionsIds[j]])
                    const question = questionRows.rows.filter((elem) => elem.id === questionsIds[j]);

                    let questionData = {
                        ...question[0],
                        answers: answersRows.rows
                    }

                    questionsData.push(questionData)
                }
                testData.push({
                    ...currentTest[0],
                    questions: [...questionsData]
                })
            }
            res.status(200).json({ status: 'success', testData })
        }
        catch (e) {
            res.status(500).json({ status: 'error' })
        }
    }

    async getTestById(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const { testId } = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный параметр',
                    status: 'error',
                });
            }

            const testsRows = await db.query(`SELECT * from tests WHERE id = ${testId}`)
            const testid = testsRows.rows[0].id;

            let testData = {};

            const questionRows = await db.query(`SELECT * from questions WHERE testid = ${testid}`) // все вопросы теста
            const questionsIds = questionRows.rows.map((item) => item?.id); // все айдишники вопросов

            let questionsData = [];

            for (let j = 0; j < questionsIds.length; j++) {
                const answersRows = await db.query('SELECT * from answers WHERE questionId = $1', [questionsIds[j]])
                const question = questionRows.rows.filter((elem) => elem.id === questionsIds[j]);

                let questionData = {
                    ...question[0],
                    answers: answersRows.rows
                }

                questionsData.push(questionData)
            }

            testData = {
                ...testsRows.rows[0],
                questions: [...questionsData]
            }
            res.status(200).json({ status: 'success', testData })


        } catch {
            res.status(500).json({ status: 'error' })
        }
    }

    async getUserTests(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный параметр',
                    status: 'error',
                });
            }

            const tests = await db.query(`SELECT * from tests WHERE creatorid = ${userId} LIMIT 20`)
            const testsIds = tests.rows.map((item) => item.id);

            let testData = [];

            for (let i = 0; i < testsIds.length; i++) {

                let currentTest = tests.rows.filter((elem) => elem.id === testsIds[i]) // текущий тест
                const questionRows = await db.query(`SELECT * from questions WHERE testid = ${testsIds[i]}`) // все вопросы теста
                const questionsIds = questionRows.rows.map((item) => item?.id); // все айдишники вопросов
                let questionsData = [];

                for (let j = 0; j < questionsIds.length; j++) {
                    const answersRows = await db.query('SELECT * from answers WHERE questionId = $1', [questionsIds[j]])
                    const question = questionRows.rows.filter((elem) => elem.id === questionsIds[j]);

                    let questionData = {
                        ...question[0],
                        answers: answersRows.rows
                    }

                    questionsData.push(questionData)
                }
                testData.push({
                    ...currentTest[0],
                    questions: [...questionsData]
                })
            }
            res.status(200).json({ status: 'success', testData })

        } catch (e) {

        }
    }
}

module.exports = new TestsController();