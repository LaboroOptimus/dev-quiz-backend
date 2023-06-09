const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { spawn } = require('child_process');

class TestsController {
    async getTests(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');

            // check users session ?
            const userId = decodedToken.userId;

            const tests = await db.query(`SELECT * from tests WHERE creatorId=${0}  LIMIT 20`)
            const testsIds = tests.rows.map((item) => item.id);

            let testData = [];

            for (let i = 0; i < testsIds.length; i++) {

                let currentTest = tests.rows.filter((elem) => elem.id === testsIds[i]) // текущий тест
                const questionRows = await db.query(`SELECT * from questions WHERE testid = ${testsIds[i]}`) // все вопросы теста

                const questionsIds = questionRows.rows.map((item) => item?.id); // все айдишники вопросов
                let questionsData = [];

                const topicsRows = await db.query(`SELECT * from test_topics WHERE testid = ${testsIds[i]}`)
                const topicIds = topicsRows.rows.map((item) => item.topicid);

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
                    questions: [...questionsData],
                    topicId: topicIds
                })
            }

            res.status(200).json({ status: 'success', data: testData })
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


            const topicsRows = await db.query(`SELECT * from test_topics WHERE testid = ${testid}`)
            const topicIds = topicsRows.rows.map((item) => item.topicid);

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
                questions: [...questionsData],
                topicId: topicIds
            }
            res.status(200).json({ status: 'success', data: testData })


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

                const topicsRows = await db.query(`SELECT * from test_topics WHERE testid = ${testsIds[i]}`)
                const topicIds = topicsRows.rows.map((item) => item.topicid);

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
                    questions: [...questionsData],
                    topicId: topicIds,
                })
            }
            res.status(200).json({ status: 'success', data: testData })

        } catch (e) {

        }
    }

    async createTest(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;
            const { levelId, name, questions, topicId, timer, isPrivate } = req.body;

            const createdTestIdResult = await db.query(
                'INSERT INTO tests (name, isusertest, timer, levelid, creatorid, isprivate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [name, true, timer, levelId, userId, isPrivate]
            );

            for (let i = 0; i < topicId.length; i++) {
                await db.query(
                    'INSERT INTO test_topics (testId, topicId) VALUES ($1, $2) RETURNING id ',
                    [createdTestIdResult.rows[0].id, topicId[i]]
                );
            }
            
            for (let i = 0; i < questions.length; i++) {
                const { title, code, isCodeQuestion } = questions[i];
                const isMultipleAnswers = questions[i].isMultipleAnswers || false;
                const createdTestId = createdTestIdResult.rows[0].id;

                const questionIdResult = await db.query(
                    'INSERT INTO questions (testId, code, title, isCodeQuestion, isMultipleAnswers) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                    [createdTestId, code, title, isCodeQuestion, isMultipleAnswers]
                );

                const questionId = questionIdResult.rows[0].id;

                for (let j = 0; j < questions[i].answers.length; j++) {
                    const { title, id } = questions[i].answers[j];
                    const isCorrectAnswer = !!questions[i].correctId.find((correctId) => correctId === id)
                    const answerId = await db.query(
                        'INSERT INTO answers (title, isCorrect, questionId) VALUES ($1, $2, $3) RETURNING id',
                        [title, isCorrectAnswer, questionId]
                    );
                }
            }
            res.status(200).json({ status: 'success', data: { id: createdTestIdResult.rows[0].id } })
        } catch (e) {
            res.status(500).json({ status: 'error', e })
        }

    }

    async testApi(req, res) {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, 'your_secret_key');
        // const userId = decodedToken.userId;
        const userId = 14;
        const { testId, result, userAnswers } = req.body;

        const childProcess = spawn('node', ['./middlewares/analytics.js', JSON.stringify(result), userId, testId]);

        childProcess.stdout.on('data', (data) => {
            console.log(`Received data from child process: ${data}`);
        });

        // Обработка ошибок из процесса
        childProcess.stderr.on('data', (data) => {
            console.error(`Error from child process: ${data}`);
        });

        // Обработка завершения процесса
        childProcess.on('close', (code) => {
            console.log(`Child process exited with code ${code}`);
        });

    }

    async answerTest(req, res) {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const userId = decodedToken.userId;
        const { testId, result, userAnswers } = req.body;

        const childProcess = spawn('node', ['./middlewares/analytics.js', JSON.stringify(result), userId, testId]);

        childProcess.on('close', (code) => {
            console.log(`Завершен успешно ${code}`);
        });

        const date = new Date();
        const timestamp = date.toISOString();

        try {
            await db.query(
                'INSERT INTO history (testId, userId, result, userAnswers, creationDate) VALUES ($1, $2, $3, $4, $5) RETURNING id ',
                [testId, userId, result, userAnswers, timestamp]
            );

            res.status(200).json({ status: 'success' })
        }
        catch (e) {
            res.status(500).json({ status: 'error', e })
        }
    }

    async getUserAnswers(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;
            const historyRows = await db.query(`SELECT id, userid, testid, result, useranswers, creationdate from history WHERE userid = ${userId}`)
            res.status(200).json({ status: 'success', data: historyRows.rows })
        }
        catch (e) {
            res.status(500).json({ status: 'error', e })
        }
    }
}

module.exports = new TestsController();