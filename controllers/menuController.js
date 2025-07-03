const { render } = require("ejs")
const { Menu, User, Order, UserProfile, OrderMenu } = require('../models/index')
const { formatRupiah } = require('../helpers/helper')
const { Op } = require("sequelize");

class menuController {
   static async getMenus(req, res) {
        try {
            const { search, success } = req.query
            let menus = await Menu.findAll({
                where: { statusMenu: 'Tersedia' },
                order: [['name', 'ASC']]
            })

            if(search) {
                menus = await Menu.findAll({
                    where: { 
                        statusMenu: 'Tersedia', 
                        name: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    order: [['name', 'ASC']],
                    
                })
            }
            // res.send(menus)
            res.render('menu', { menus, formatRupiah, success })
        } catch(error) {
            console.log(error, '<== error get menus')
            res.send(error)
        }
    }
}

module.exports = menuController