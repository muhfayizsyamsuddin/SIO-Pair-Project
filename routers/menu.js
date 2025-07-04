const express = require('express')
const router = express.Router()
const MenuController = require('../controllers/menuController')
const { isLogin, isAdmin } = require('../middleware/auth'); 

router.get('/', MenuController.getMenus);

module.exports = router