const Router = require('express')
const router = new Router()
const { body, withMessage } = require('express-validator');

const testsController = require('../controllers/tests.controller')

const testByIdChecks = [
    body('testId').isNumeric().withMessage('Incorrect parametr'),
]

const userTestsChecks = [
    body('userId').isNumeric().withMessage('Incorrect parametr'),
]

router.get(
    '/getAllTests',
    testsController.getTests
);

router.post(
    '/getTestById',
    [...testByIdChecks],
    testsController.getTestById
);

router.get(
    '/getUserTests',
    testsController.getUserTests
)

router.post(
    '/createTest',
    testsController.createTest
)

router.post(
    '/answerTest',
    testsController.answerTest
)

router.get(
    '/getHistory',
    testsController.getUserAnswers
)

router.get(
    '/testApi',
    testsController.testApi
)

module.exports = router;
