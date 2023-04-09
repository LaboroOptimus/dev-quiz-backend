const Router = require('express')
const router = new Router()
const { body, withMessage } = require('express-validator');

const userController = require('../controllers/user.controller')

const registerChecks = [
    body('email').isEmail().withMessage('Incorrect email'),
    body('password').isLength({ min: 5 }).withMessage('Incorrect password'),
]

const loginChecks = [
    body('email').isEmail().withMessage('Incorrect email'),
    body('password').isLength({ min: 5 }).withMessage('Incorrect password'),
]

router.post(
    '/register',
    [...registerChecks],
    userController.register
);

router.post(
    '/login',
    [...loginChecks],
    userController.login
);

router.get(
    '/currentUser',
    userController.getCurrentUser
)

module.exports = router;