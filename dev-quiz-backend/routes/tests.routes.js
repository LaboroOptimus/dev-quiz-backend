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
    [...userTestsChecks],
    testsController.getUserTests
)

module.exports = router;