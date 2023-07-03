const Router = require('express')
const router = new Router()
const { body, withMessage } = require('express-validator');

const trainController = require('../controllers/train.controller')

router.post(
    '/startTrain',
    trainController.startTrain
);

router.post(
    '/answerTrainQuestion',
    trainController.answerTrainQuestion
);

router.post(
    '/explainTrainQuestion',
    trainController.explainTrainQuestion
);

router.post(
    '/updateTrainingHistory',
    trainController.updateHistory
)

// startTrain(язык, уровень, есть ли задачи на лайвкод или нет) => массив вопросов по языку и уровню

// answerTrainQuestions(id вопроса) => true/false

// explainTrainQuestion(id вопроса) => string



// пользователь вводит тему и уровень => получает массив вопросов. (текстовых или на написание кода)
// фронт отображает первый вопрос - пользователь вводит ответ - отправляет id вопроса на бек.
// бек отправляет запрос в open ai - получает ответ (true/false). 
// бек отвечает пользователю - корректно или некорректно
// На фронте есть кнопка которая может показать объяснение. если нажимает - снова отправить запрос в open ai

module.exports = router;