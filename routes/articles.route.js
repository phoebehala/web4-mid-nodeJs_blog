const express =require('express');
const router = express.Router()
const Article = require('../models/article')
const articleController = require('../controllers/article.controller');


router.get('/', articleController.getArticles)  // localhost:port/articles/

router.get('/create', articleController.createArticle) 

router.get('/:id', articleController.getById )

router.post('/create', articleController.postArticle)

router.get('/edit/:id', articleController.getEditById )

// form method only allow us to 'POST' or 'GET'
router.put('/edit/:id', articleController.putArticle)

// form method only allow us to 'POST' or 'GET'
router.delete('/:id', articleController.deleteArticle)

module.exports = router