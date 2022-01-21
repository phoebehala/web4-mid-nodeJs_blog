const express =require('express');
const router = express.Router()

// const Article = require('../models/article')
const authController = require('../controllers/auth.controller');


router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignUp);

router.post('/signup', authController.postSignup );

router.post('/logout',authController.postLogout );

module.exports = router