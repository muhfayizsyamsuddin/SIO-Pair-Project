const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.homePage)
// router.get('/user', userController.homePage)
// router.get('/user', userController.homePage)
// router.get('/user', userController.homePage)
// router.get('/user', userController.homePage)

module.exports = router