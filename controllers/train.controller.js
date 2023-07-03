const db = require('../db');
const jwt = require('jsonwebtoken');
const { Configuration, OpenAIApi } = require("openai");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const functions = require('../utils/functions')

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY
});

const openai = new OpenAIApi(configuration);

class TrainController {
    async startTrain(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;

            const { topicId, levelId } = req.body;

            // TODO: выбирать рандомные вопрос + выбирать 10 штук

            const questionsRows = await db.query(`SELECT * from trainquestions WHERE topicId = ${topicId} AND levelId = ${levelId}`)

            res.status(200).json({ status: 'success', data: questionsRows.rows })
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async answerTrainQuestion(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;

            const { id, answer } = req.body;

            const questionRow = await db.query(`SELECT * from trainquestions WHERE id = ${id}`)
            const openAiString = functions.getOpenAiString(questionRow.rows[0].title, answer)

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                temperature: 0,
                max_tokens: 1,
                messages: [
                    {
                        role: "user",
                        content: openAiString
                    }],
            });

            const result = {
                id: id,
                question: questionRow.rows[0].title,
                answer: answer,
                result: completion.data.choices[0].message.content === '1' ? true : false
            }

            res.status(200).json({ status: 'success', data: result })
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async explainTrainQuestion(req, res) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const userId = decodedToken.userId;
            const { id, question } = req.body;

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: functions.getOpenAiExplainationString(question)
                    }],
            });

            res.status(200).json({ status: 'success', data: { id, question, answer: completion.data.choices[0].message.content } })
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new TrainController();