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
            console.log(testData)
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
                'INSERT INTO tests (name, isUserTest, timer, levelId, creatorId, isPrivate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
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

    async answerTest(req, res) {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const userId = decodedToken.userId;
        const { testId, result, userAnswers } = req.body;

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

// const test = {
//     levelId: 0,
//     name: 'Test test from DB',
//     questions: [
//         {
//             title: 'Тестовый вопрос 1',
//             code: '',
//             isCodeQuestion: false,
//             isMultipleAnswers: true,
//             answers: [
//                 {
//                     title: 'Ответ 1',
//                     isCorrect: true,
//                 },
//                 {
//                     title: 'Ответ 2',
//                     isCorrect: false,
//                 }
//             ]
//         },
//         {
//             title: 'Тестовый вопрос 2',
//             code: '',
//             isCodeQuestion: false,
//             isMultipleAnswers: true,
//             answers: [
//                 {
//                     title: 'Ответ 3',
//                     isCorrect: true,
//                 },
//                 {
//                     title: 'Ответ 4',
//                     isCorrect: false,
//                 }
//             ]
//         }
//     ],
//     topicId: 0,
//     timer: 100,
// }

module.exports = new TestsController();