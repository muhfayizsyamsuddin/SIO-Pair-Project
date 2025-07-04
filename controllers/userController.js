const { render } = require("ejs")
const { Menu, User, Order, UserProfile, OrderMenu } = require('../models/index')
const { formatRupiah, generateInvoice } = require('../helpers/helper')
const { Op, Model } = require("sequelize");
const bcrypt = require('bcryptjs');
const easyinvoice = require('easyinvoice');
const fs = require('fs').promises


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
            // console.log(user);
            
            res.render('profile', { user })
            // res.send(user)
        } catch(error) {
            console.log(error, '<--------- userProfile');
            res.send(error)
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
            let newId = await User.create({username, email, password, role})
            
            await UserProfile.create({photoUrl, address, UserId: newId.id})
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

    static async getLogout (req, res) {
        try {
            req.session.destroy()
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }

    static async allUser (req, res) {
        try {
            const { userId } = req.session 
            const user = await User.findAll({
                include: Order
            })
            // res.send(user)
            res.render('auth-pages/allUser', { user })
        } catch (error) {
            res.send(error)
        }
    }

    // static async deleteUser(req, res) {
    //     try {
    //         const { userId } = req.params;
    //         await User.destroy({
    //             where: {
    //             id: userId
    //             }
    //         });
    //         res.redirect('/');
    //     } catch (error) {
    //         res.send(error);
    //     }
    // }
}

module.exports = userController