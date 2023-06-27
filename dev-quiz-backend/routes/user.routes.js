const Router = require('express')
const router = new Router()
const { body, withMessage } = require('express-validator');
const fileMiddleware = require('../middlewares/file');

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

router.post(
    '/uploadImage',
    fileMiddleware.single('avatar'),
    userController.uploadImage
)

router.post(
    '/editUserAvatar',
    fileMiddleware.single('avatar'),
    userController.updateUserAvatar
)

router.post(
    '/editUserInfo',
    userController.updateUserInfo
)


module.exports = router;