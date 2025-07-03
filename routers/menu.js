const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menuController')


router.get('/', menuController.getMenus);
router.get('/menus', menuController.getMenus);
// router.get('/menus')

module.exports = router