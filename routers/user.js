const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { isLogin, isAdmin } = require('../middleware/auth'); 

router.get('/register', userController.registerForm)
router.post('/register', userController.postRegister)
router.get('/login', userController.loginForm)
router.post('/login', userController.postLogin)
router.get('/logout', userController.getLogout)
router.get('/', userController.homePage)
router.get('/userprofile/:userId', userController.userProfile)
router.get('/allUsers/:userId', isAdmin, userController.allUser)

module.exports = router