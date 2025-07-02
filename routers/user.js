const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')





router.get('/register', userController.registerForm)
router.post('/register', userController.postRegister)
router.get('/login', userController.loginForm)
router.post('/login', userController.postLogin)

router.use((req, res, next) => {  //! middleware global
    console.log(req.session)
    if (!req.session.userId) {
        const error = 'Please login first!'
        res.redirect(`/login?error=${error}`)
    } else {
        console.log('Time:', Date.now())
        next()
    }
})
// 12345
// 6789
router.use((req, res, next) => {  //! middleware global
    console.log(req.session)
    if (req.session.role && req.session.role !== 'admin') {
        const error = 'You have no access!'
        res.redirect(`/login?error=${error}`)
    } else {
        console.log('Time:', Date.now())
        next()
    }
})

// const mw = function (req, res, next) {  //! func middleware per route
//     console.log('Time:', Date.now())
//     next()
// }

router.get('/', userController.homePage)
router.get('/menus', userController.getMenus);
router.get('/logout', userController.getLogout)
// router.get('/user', userController.homePage)
// router.get('/user', userController.homePage)

module.exports = router