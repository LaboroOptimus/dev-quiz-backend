const Router = require('express')
const router = new Router()

const blogController = require('../controllers/blog.controller')

router.get(
    '/getAllArticles',
    blogController.getAllArticles
);

router.post(
    '/createArticle',
    blogController.createArticle
);

router.post(
    '/getArticleById',
    blogController.getArticleById,
)

router.post(
    '/getArticleByTopics',
    blogController.getArticleByTopics,
)

module.exports = router;
 