const Router = require('express')
const router = new Router()
const { body, withMessage } = require('express-validator');

const testsController = require('../controllers/tests.controller')

router.get(
    '/getAllTests',
    testsController.getTests
);

router.post(
    '/getTestById',
    testsController.getTestById
);

router.get(
    '/getUserTests',
    testsController.getUserTests
)


module.exports = router;