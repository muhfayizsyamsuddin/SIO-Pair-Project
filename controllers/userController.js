const { render } = require("ejs")
const { Menu, User, Order, UserProfile, OrderMenu } = require('../models/index')
const { formatRupiah } = require('../helpers/helper')
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');


class userController {
    static async homePage (req, res) {
        try {
            const { userId } = req.session;
            let user = await User.greeting(userId)
            // console.log(req.session);
            res.render('homepage', {user})
        } catch (error) {
            console.log(error, '========');
            
            res.send(error)
        }
    }

    static async userProfile(req, res) {
        try {
            const { userId } = req.session 
            let user = await User.findByPk(userId, {
                include: UserProfile
            })
            res.render('profile', { user })
        } catch(error) {
            console.log(error, '<--------- userProfile');
            res.send(error)
        }
    }

    // static async getMenus(req, res) {
    //     try {
    //         const { search, success } = req.query
    //         let menus = await Menu.findAll({
    //             where: { statusMenu: 'Tersedia' },
    //             order: [['name', 'ASC']]
    //         })

    //         if(search) {
    //             menus = await Menu.findAll({
    //                 where: { 
    //                     statusMenu: 'Tersedia', 
    //                     name: {
    //                         [Op.iLike]: `%${search}%`
    //                     }
    //                 },
    //                 order: [['name', 'ASC']],
                    
    //             })
    //         }
    //         // res.send(menus)
    //         res.render('menu', { menus, formatRupiah, success })
    //     } catch(error) {
    //         console.log(error, '<== error get menus')
    //         res.send(error)
    //     }
    // }

    static async getOrders(req, res) {
        try {
            const { success } = req.query
            const userId = req.session.userId
            
            const orders = await Order.findAll({
                where: { 
                    UserId: userId 
                },
                include: {
                    model: OrderMenu,
                    include: Menu
                },
                order: [['createdAt', 'DESC']]
            })

            res.render('orders', { orders, success})
        } catch(error) {
            console.log(error, '<== error get order')
            res.send(error)
        }
    }

    static async payOrder(req, res) {
        try {
            const { menuId } = req.params;

            const order = await Order.findByPk(menuId);
            
            await order.update({ statusOrder: 'completed' });

            res.redirect('/orders?success=Pembayaran berhasil!');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }   


    static async handlerEdit(req, res) {
        try {
            const { menuId } = req.params
            const { quantity } = req.body

            const orderMenu = await OrderMenu.findByPk(menuId, {
                include: Order
            })

            await orderMenu.update(
                { quantity }
            )

            res.redirect('/orders?success=Quantity updated')
        } catch(error) {
            console.log(error, '<== error handler edit')
        }
    }

    static async handlerDelete(req, res) {
        try {

            const { menuId } = req.params

            const orderMenu = await OrderMenu.findByPk(menuId, {
                include: Order
            });

            await orderMenu.destroy();

            res.redirect('/orders?success=Item berhasil dihapus');
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }


    static async postOrder(req, res) {
        try {
            
            const UserId = req.session.userId;
            const MenuId = +req.params.menuId;
            const quantity = 1

            const menu = await Menu.findByPk(MenuId);

            const order = await Order.create({
                UserId,
                statusOrder: "active"
            })

            await OrderMenu.create({
                OrderId: order.id,
                MenuId,
                quantity,
                priceAtOrder: menu.price
            })

            res.redirect('/menus?success=Order berhasil!');
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    static async registerForm (req, res) {
        try {
            const { err } = req.query
            res.render('auth-pages/register-form', {err})
        } catch (error) {
            console.log(error, '========');
            
            res.send(error)
        }
    }

    static async postRegister (req, res) {
        try {
            const { username, email, password, role, photoUrl, address, UserId } = req.body
            console.log(req.body)
            await User.create({username, email, password, role})
            await UserProfile.create({photoUrl, address, UserId: UserId})
            // res.redirect('/login')
            res.redirect('/login')
        } catch (error) {
            console.log(error, '========');
            if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
                let err = error.errors.map(el => {
                    return el.message
                })
                res.redirect(`/register?err=` + err)
            } else {
                res.send(error)
            }
        }
    }

    static async loginForm (req, res) {
        try {
            const { error } = req.query
            res.render('auth-pages/login-form', {error})
        } catch (error) {
            console.log(error, '========');
            
            res.send(error)
        }
    }

    static async postLogin (req, res) {
        try {
            const { username, password } = req.body
            console.log(req.body)
            const user = await User.findOne({
                where: {
                    username
                }
            })

            if (user) {
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (isValidPassword) {
                    req.session.userId = user.id
                    req.session.role = user.role;
                    return res.redirect('/')
                } else {
                    const error = 'Invalid username or password' 
                    return res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = 'Invalid username or password' 
                    return res.redirect(`/login?error=${error}`)
            }
            // res.render('homepage', {user})
        } catch (error) {
            console.log(error, '========');
            res.send(error)
        }
    }

    // static async getLogout (req, res) {
    //     try {
    //         req.session.destroy()
    //         res.redirect('/login')
    //     } catch (error) {
    //         res.send(error)
    //     }
    // }

    static async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            await User.destroy({
                where: {
                id: userId
                }
            });
            res.redirect('/');
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = userController