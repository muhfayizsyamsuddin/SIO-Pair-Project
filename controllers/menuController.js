const { Menu, Order, OrderMenu } = require('../models/index')
const { Op } = require('sequelize');

class menuController {
    static async getMenus(req, res) {
        try {
            const menus = await Menu.findAll({
                where: { statusMenu: 'Tersedia' },
                order: [['name', 'ASC']]
            })
            // res.send(menus)
            res.render('menu', { menus })
        } catch(error) {
            console.log(error, '<== error get menus')
            res.send(error)
        }
    }
}

module.exports = menuController