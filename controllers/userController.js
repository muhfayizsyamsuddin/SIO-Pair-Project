const { render } = require("ejs")
const { Menu, User, Order } = require('../models/index')
const { formatRupiah } = require('../helpers/helper')
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');


class userController {
    static async homePage (req, res) {
        try {
            res.render('homepage')
        } catch (error) {
            console.log(error, '========');
            
            res.send(error)
        }
    }

    static async getMenus(req, res) {
        try {
            const { search } = req.query
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
            res.render('menu', { menus, formatRupiah })
        } catch(error) {
            console.log(error, '<== error get menus')
            res.send(error)
        }
    }

    static async registerForm (req, res) {
        try {
            res.render('auth-pages/register-form')
        } catch (error) {
            console.log(error, '========');
            
            res.send(error)
        }
    }

    static async postRegister (req, res) {
        try {
            const { username, email, password, role } = req.body
            console.log(req.body)
            await User.create({username, email, password, role})
            res.redirect('/login')
        } catch (error) {
            console.log(error, '========');
            res.send(error)
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
        } catch (error) {
            console.log(error, '========');
            res.send(error)
        }
    }

    static async getLogout (req, res) {
        try {
            req.session.destroy()
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }
//     static async homepage(req, res) {
//     try {
//       const { userId } = req.session;
//       const user = await User.myFullProfiles(userId);
//       res.render('homepage', { user });
//     } catch (error) {
//       res.send(error);
//     }
//   }
//   static async handlerLogin(req, res) {
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({
//         where: {
//           email
//         }
//       });
//       if (user) {
//         const isValid = comparePass(password, user.password);
//         if (isValid) {
//           req.session.userId = user.id;
//           req.session.role = user.role;
//           res.redirect('/');
//         } else {
//           const error = 'Email or Password is wrong';
//           res.redirect(`/login?error=${error}`);
//         }
//       } else {
//         const error = 'Email not found';
//         res.redirect(`/login?error=${error}`);
//       }
//     } catch (error) {
//       res.send(error);
//     }
//   }
//   static async handlerLogout(req, res) {
//     try {
//       req.session.destroy();
//       res.redirect('/login');
//     } catch (error) {
//       res.send(error);
//     }
//   }
//   static async deleteUser(req, res) {
//     try {
//       const { userId } = req.params;
//       await User.destroy({
//         where: {
//           id: userId
//         }
//       });
//       res.redirect('/');
//     } catch (error) {
//       res.send(error);
//     }
//   }
}

module.exports = userController